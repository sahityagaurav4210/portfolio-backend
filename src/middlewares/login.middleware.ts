import { NextFunction, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { User } from '../models/users.model';
import { Login } from '../models/login.model';
import bcrypt from 'bcrypt';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';
import { performParallelTask } from '../helpers';
import { DBType } from '../types';
import { ILogins, IUser } from '../interfaces/users.interface';
import { modelUpdateObject } from '@config/db_models.config';
import connectRedis from '@config/redis.config';
import { init } from '@config/logs.config';
import { Environments } from '../constant';

class LoginMiddleware {
  @HandleException()
  public static async checkIfCredentialsAreCorrect(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    let { phone, password } = request.body;
    const token = request.cookies.token || request.headers['x-token'];
    let [userRecord, loginRecord, sessionRecord] = await performParallelTask([
      User.findOne({ phone }).select('+password'),
      Login.findOne({ phone }),
      Login.findOne({ $and: [{ phone }, { 'sessions.isLoggedIn': true }, { 'sessions.token': token }] }),
    ]);

    userRecord = userRecord as DBType<IUser>;
    loginRecord = loginRecord as DBType<ILogins>;
    sessionRecord = sessionRecord as DBType<ILogins>;

    if (sessionRecord) {
      await Login.findOneAndUpdate(
        { _id: loginRecord._id, 'sessions.token': token },
        { $set: { 'sessions.$.logoutAt': new Date(), 'sessions.$.isLoggedIn': false } },
        modelUpdateObject()
      );
    }

    if (userRecord && (await bcrypt.compare(password, userRecord.password))) {
      request.userRecord = userRecord;
      request.loginRecord = loginRecord;
      return next();
    }

    reply.STATUS = Status.UNAUTHORISED;
    reply.MESSAGE = 'Invalid credentials';
    reply.ENTRY_BY = phone || request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
  }

  @HandleException()
  public static async checkIfCaptchaValidated(request: CustomReq, response: Response, next: NextFunction) {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const logger = init();

    const { captchaId } = request.body;
    const keyName = `portfolio_backend:captcha:${captchaId}`;
    const appEnvironment = process.env.APP_ENV || 'local';
    const stringifiedPayload = await REDIS_CLIENT.get(keyName) || "";

    if (appEnvironment === Environments.LOCAL) return next();

    if (!stringifiedPayload) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid captcha details';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({
        message: `There's something went wrong with payload of provided captchaId - ${captchaId}.`,
      });

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    const { verified } = JSON.parse(stringifiedPayload);

    if (!verified) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Your have not proven your identity, please solve the captcha first.';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({
        message: `There's something went wrong with payload of provided captchaId - ${captchaId}.`,
        verified,
      });

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    return next();
  }
}

export default LoginMiddleware;

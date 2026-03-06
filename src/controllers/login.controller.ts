import { Response } from 'express';
import { Login } from '../models/login.model';
import { generateToken } from '../helpers';
import { Tokens } from '../constant';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';
import { modelUpdateObject } from '../config/db_models.config';
import connectRedis from '@config/redis.config';

class LoginController {
  @HandleException()
  public static async login(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();

    const { phone } = request.body;
    let { loginRecord, userRecord } = request;

    const appEnvironment = process.env.APP_ENV || 'local';
    const isSecureCookie = appEnvironment !== 'local';

    const access_token = generateToken(phone, Tokens.ACCESS);
    const refresh_token = generateToken(phone, Tokens.REFRESH);
    const sessions = { token: refresh_token, isLoggedIn: true, loginAt: new Date(), access_token };

    if (loginRecord) {
      loginRecord.sessions.push(sessions);
      loginRecord.updatedAt = new Date();

      await loginRecord.save();
    } else {
      await Login.create({
        phone,
        loggedInUser: userRecord,
        sessions: [sessions],
      });
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Login successfull';
    reply.DATA = {
      access_token,
      refresh_token,
      phone,
      name: userRecord.name,
      _id: userRecord._id,
      email: userRecord.email,
    };
    reply.ENTRY_BY = phone;

    response.cookie('authorization', access_token, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: isSecureCookie ? 'none' : 'lax',
    });

    response.cookie('token', refresh_token, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: isSecureCookie ? 'none' : 'lax',
    });

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async logout(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const reply = new ApiResponse();

    let authorization = request.headers.authorization || request.cookies.authorization || '';
    let refreshToken = request.headers['x-ref-token'] || request.cookies.token || '';

    if (!authorization || !refreshToken) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Please provide valid tokens';
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    if (authorization.startsWith('Bearer')) {
      authorization = authorization.split('Bearer ')[1];
    }

    const { _id } = authenticatedUser;
    const REDIS_CLIENT = connectRedis();
    const user = await Login.findOneAndUpdate(
      { loggedInUser: _id, 'sessions.token': refreshToken },
      { $set: { 'sessions.$.logoutAt': new Date(), 'sessions.$.isLoggedIn': false } },
      modelUpdateObject()
    );

    if (user) {
      await REDIS_CLIENT.del(`portfolio-backend:auth:${authorization}`);

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Logout successful';
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    } else {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid user';
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }
  }
}

export default LoginController;

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

class LoginMiddleware {
  @HandleException()
  public static async checkIfCredentialsAreCorrect(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    let { phone, password } = request.body;
    let [userRecord, loginRecord, sessionRecord] = await performParallelTask([
      User.findOne({ phone }).select('+password'),
      Login.findOne({ phone }),
      Login.findOne({ $and: [{ phone }, { 'signins.isLoggedIn': true }] }),
    ]);

    userRecord = userRecord as DBType<IUser>;
    loginRecord = loginRecord as DBType<ILogins>;
    sessionRecord = sessionRecord as DBType<ILogins>;

    if (sessionRecord) {
      reply.STATUS = Status.FORBIDDEN;
      reply.MESSAGE = "There's an active session for this user.";
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.FORBIDDEN).json(reply);
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
}

export default LoginMiddleware;

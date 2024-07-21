import { NextFunction, Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { User } from '../models/users.model';
import { Login } from '../models/login.model';
import bcrypt from 'bcrypt';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';

class LoginMiddleware {
  @HandleException()
  public static async checkIfCredentialsAreCorrect(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    let { phone, password } = request.body;
    let [userRecord, loginRecord] = await Promise.all([
      User.findOne({ phone }),
      Login.findOne({ phone }),
    ]);

    if (userRecord && (await bcrypt.compare(password, userRecord.password))) {
      request.userRecord = userRecord;
      request.loginRecord = loginRecord;
      return next();
    }

    const reply = new ApiResponse();
    reply.STATUS = Status.UNAUTHORISED;
    reply.MESSAGE = 'Invalid phone or password';
    reply.ENTRY_BY = phone;

    return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
  }
}

export default LoginMiddleware;

import { NextFunction, Request, Response } from 'express';
import LoginMiddleware from './login.middleware';
import { HandleException } from '../decorators/exception.decorator';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
import { Model } from 'mongoose';
import { ILogins } from '../interfaces/users.interface';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';

class Middleware {
  public static authentication() {
    return LoginMiddleware;
  }

  @HandleException()
  public static async checkIfAuthenticated(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    const { cookies } = request;
    const reply = new ApiResponse();

    const authorization = cookies.authorization;

    if (!authorization) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Token is required';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const tokenPayload: jwt.JwtPayload | string = jwt.verify(
      authorization,
      process.env.ACCESS_TOKEN_SEC || ''
    );
    let userRecord: Model<ILogins> | null = null;

    if (typeof tokenPayload !== 'string')
      userRecord = await User.findOne({ phone: tokenPayload.phone });

    if (!userRecord) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    request.authenticatedUser = userRecord;
    return next();
  }
}

export default Middleware;

import { NextFunction, Request, Response } from 'express';
import LoginMiddleware from './login.middleware';
import { HandleException } from '../decorators/exception.decorator';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';
import { Login } from '../models/login.model';
import { decryptXApiToken } from '../helpers';
import { CLIENT_URL } from '../constant';
import ContractMiddleware from './contracts.middleware';

class Middleware {
  public static authentication() {
    return LoginMiddleware;
  }

  public static contract() {
    return ContractMiddleware;
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

    if (typeof tokenPayload !== 'string') {
      const [userRecord, loginRecord] = await Promise.all([
        User.findOne({ phone: tokenPayload.phone }),
        Login.findOne({ $and: [{ phone: tokenPayload.phone }, { 'signins.isLoggedIn': true }] }),
      ]);

      if (!userRecord || !loginRecord) {
        reply.STATUS = Status.UNAUTHORISED;
        reply.MESSAGE = 'Invalid token';

        return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
      }

      request.authenticatedUser = userRecord;
    }

    return next();
  }

  @HandleException()
  public static async checkIfClientAuthenticated(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    let x_api_key = request.headers['x-api-key'] || request.cookies.x_api_key;

    if (Array.isArray(x_api_key)) x_api_key = x_api_key[0];

    const tokenPayload = decryptXApiToken(x_api_key || '');
    const reply = new ApiResponse();

    if (typeof tokenPayload !== 'string' && tokenPayload.data === CLIENT_URL) {
      return next();
    } else {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Unauthorised';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }
  }
}

export default Middleware;

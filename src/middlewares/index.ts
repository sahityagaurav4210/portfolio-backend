import { NextFunction, Response } from 'express';
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
import PortfolioMiddleware from './portfolio.middleware';
import TokenMiddleware from './token.middleware';

class Middleware {
  public static authentication() {
    return LoginMiddleware;
  }

  public static contract() {
    return ContractMiddleware;
  }

  public static portfolio() {
    return PortfolioMiddleware;
  }

  public static token() {
    return TokenMiddleware;
  }

  @HandleException()
  public static async checkIfAuthenticated(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    const { cookies } = request;
    let { authorization } = request.headers;
    const reply = new ApiResponse();
    const { REDIS_CLIENT } = globalThis as Record<string, any>;

    authorization = authorization ? authorization.split('Bearer ')[1] : cookies.authorization;

    if (!authorization) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Token is required';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }
    const cachedAuthKey = `portfolio-backend:auth:${authorization}`;
    const cachedAuthorization = await REDIS_CLIENT.get(cachedAuthKey);

    if (cachedAuthorization) {
      request.authenticatedUser = JSON.parse(cachedAuthorization);
      return next();
    }

    const tokenPayload: jwt.JwtPayload | string = jwt.verify(
      authorization,
      process.env.ACCESS_TOKEN_SEC || ''
    );

    if (typeof tokenPayload === 'string') {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    const timeout = (Number(process.env.REDIS_CACHED_AUTH_EXP) || 10) * 60;
    const [userRecord, loginRecord] = await Promise.all([
      User.findOne({ phone: tokenPayload.phone }),
      Login.findOne({ $and: [{ phone: tokenPayload.phone }, { 'signins.isLoggedIn': true }] }),
    ]);

    if (!userRecord || !loginRecord) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    await REDIS_CLIENT.setex(cachedAuthKey, timeout, JSON.stringify(userRecord));
    request.authenticatedUser = userRecord;

    return next();
  }

  @HandleException()
  public static async checkRefToken(request: CustomReq, response: Response, next: NextFunction) {
    const reply = new ApiResponse();
    const authorization = request.headers.refreshtoken as string;
    const { REDIS_CLIENT } = globalThis as Record<string, any>;

    if (!authorization) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Token is required';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }
    const cachedAuthKey = `portfolio-backend:auth:ref-tokens:${authorization}`;
    const cachedAuthorization = await REDIS_CLIENT.get(cachedAuthKey);

    if (cachedAuthorization) {
      request.authenticatedUser = JSON.parse(cachedAuthorization);
      return next();
    }

    const tokenPayload: jwt.JwtPayload | string = jwt.verify(
      authorization,
      process.env.REFRESH_TOKEN_SEC || ''
    );

    if (typeof tokenPayload === 'string') {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    const timeout = (Number(process.env.REDIS_CACHED_AUTH_EXP) || 10) * 60;
    const userRecord = await User.findOne({ phone: tokenPayload.phone });

    if (!userRecord) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    await REDIS_CLIENT.setex(cachedAuthKey, timeout, JSON.stringify(userRecord));
    request.authenticatedUser = userRecord;

    return next();
  }

  @HandleException()
  public static async checkIfClientAuthenticated(
    request: CustomReq,
    response: Response,
    next: NextFunction
  ) {
    let x_api_key = (request.headers['x-api-key'] || request.cookies.x_api_key) as string;
    const tokenPayload = decryptXApiToken(x_api_key || '');
    const reply = new ApiResponse();

    if (typeof tokenPayload !== 'string') {
      request.authenticatedUser = tokenPayload;
      return next();
    } else {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Unauthorised';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }
  }
}

export default Middleware;

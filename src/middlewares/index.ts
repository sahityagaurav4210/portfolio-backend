import { NextFunction, Request, Response } from 'express';
import LoginMiddleware from './login.middleware';
import { HandleException } from '../decorators/exception.decorator';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';
import { Login } from '../models/login.model';
import { decryptXApiToken } from '../helpers';
import { Environments, GlobalRegex } from '../constant';
import ContractMiddleware from './contracts.middleware';
import PortfolioMiddleware from './portfolio.middleware';
import TokenMiddleware from './token.middleware';
import connectRedis from '@config/redis.config';
import { init } from '@config/logs.config';
import SkillMiddleware from './skills.middleware';
import HomeMiddleWare from './home.middleware';
import HiringMiddleware from './hiring.middleware';

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

  public static skills() {
    return SkillMiddleware;
  }

  public static home() {
    return HomeMiddleWare;
  }

  public static hiring() {
    return HiringMiddleware;
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
    const REDIS_CLIENT = connectRedis();
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
      User.findOne({ phone: tokenPayload.phone }).lean(true),
      Login.findOne({
        $and: [
          { phone: tokenPayload.phone },
          { 'sessions.isLoggedIn': true },
          { 'sessions.access_token': authorization },
        ],
      }).lean(true),
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
    const authorization = request.headers['x-ref-token'] as string;
    const REDIS_CLIENT = connectRedis();

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
    const userRecord = await User.findOne({ phone: tokenPayload.phone }).lean(true);

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

  @HandleException()
  public static postmanMiddleware(request: Request, response: Response, next: NextFunction) {
    const environment = process.env.NODE_ENV || 'development';
    const headers = request.headers['x-user-id'] as string;
    const logger = init();
    const reply = new ApiResponse();

    logger.info({ message: `A request made with ${headers} header` });

    if (environment === Environments.PRODUCTION && headers) {
      if (!GlobalRegex.USER_AGENT.test(headers)) {
        reply.STATUS = Status.UNAUTHORISED;
        reply.MESSAGE = 'Unauthorized request';
        reply.ENTRY_BY = request.ip || '0.0.0.0';

        return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
      } else return next();
    } else if (environment === Environments.PRODUCTION && !headers) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid request';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    } else next();
  }

  @HandleException()
  public static captchaValidateValidator(request: Request, response: Response, next: NextFunction) {
    const { captcha, captchaId } = request.query;
    const reply = new ApiResponse();

    if (!captcha || !captchaId) {
      reply.STATUS = Status.UNDEFINED;
      reply.MESSAGE = 'Please provide a valid captcha';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    next();
  }

  @HandleException()
  public static refreshCaptchaValidator(request: Request, response: Response, next: NextFunction) {
    const { captchaId } = request.query;
    const reply = new ApiResponse();

    if (!captchaId) {
      reply.STATUS = Status.UNDEFINED;
      reply.MESSAGE = 'Please provide a valid captcha';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    next();
  }

  @HandleException()
  public static globalAppResponse(request: Request, response: Response, next: NextFunction) {
    response.setHeader('X-Powered-By', 'Coding Works');
    response.setHeader('Server', 'Coding Works');

    next();
  }
}

export default Middleware;

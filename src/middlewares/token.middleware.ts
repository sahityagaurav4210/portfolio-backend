import { NextFunction, Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import Joi from 'joi';
import { IClientToken } from '../interfaces';
import { ValidationMessages } from '../helpers';

export default class TokenMiddleware {
  @HandleException()
  public static async createNewToken(request: Request, response: Response, next: NextFunction) {
    const reply = new ApiResponse();
    const { ...payload } = request.body;

    const schema = Joi.object<IClientToken>().keys({
      url: Joi.string()
        .uri({
          domain: {
            tlds: {
              allow: ['in', 'com', 'xyz', 'ca', 'us', 'uk', 'app', 'online', 'dev', 'shop'],
            },
          },
        })
        .min(5)
        .max(100)
        .required()
        .messages(ValidationMessages.client_token),
    });
    const validationResult = schema.validate(payload);

    if (!validationResult.error) return next();
    else {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = validationResult.error.details[0].message;
      reply.DATA = validationResult.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.INV_PAYLOAD).json(reply);
    }
  }
}

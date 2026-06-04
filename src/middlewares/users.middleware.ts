import Joi from 'joi';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { CustomReq } from '@interfaces/index';
import { NextFunction, Response } from 'express';
import Patterns from '@book-junction/patterns';
import { ValidationMessages } from '@helpers/messages.helper';
import { GlobalRegex } from '../constant';

class UsersMiddleware {
  public static validateEditProfile(request: CustomReq, response: Response, next: NextFunction) {
    const { body } = request;
    const reply = new ApiResponse();

    const schema = Joi.object().keys({
      name: Joi.string()
        .optional()
        .pattern(Patterns.common.name)
        .messages(ValidationMessages.commons.name),
      email: Joi.string()
        .optional()
        .pattern(Patterns.common.email)
        .messages(ValidationMessages.commons.email),
      phone: Joi.string()
        .optional()
        .pattern(Patterns.common.phone)
        .messages(ValidationMessages.commons.phone),
      address: Joi.string()
        .optional()
        .min(10)
        .max(512)
        .messages(ValidationMessages.commons.address),
      websites: Joi.string()
        .optional()
        .min(10)
        .max(1000)
        .messages(ValidationMessages.commons.websites),
    });

    const result = schema.validate(body);

    if (result.error) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = result.error.details[0].message;
      reply.ENTRY_BY = request.authenticatedUser?.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    console.log(body.websites, 'websites');

    if (!GlobalRegex.MULTIPLE_URLS.test(body.websites)) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'One or more website urls are invalid.';
      reply.ENTRY_BY = request.authenticatedUser?.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const websites = body?.websites?.split(',').map((url: string) => url.trim()) || [];
    const invalidUrl = websites.find((url: string) => !Patterns.common.url.test(url));

    if (invalidUrl) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'One or more website urls are invalid.';
      reply.ENTRY_BY = request.authenticatedUser?.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    next();
  }
}

export default UsersMiddleware;

import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { init } from '@config/logs.config';
import { HandleException } from '@decorators/exception.decorator';
import { ValidationMessages } from '@helpers/messages.helper';
import { IHiring } from '@interfaces/hiring.interface';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { GlobalRegex, HiringType } from '../constant';
import connectRedis from '@config/redis.config';
import { ICaptchaPayload } from '@interfaces/captcha.interface';
import Patterns from '@book-junction/patterns';

export default class HiringMiddleware {
  @HandleException()
  public static async addHiringDetailsValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    const { ...payload } = request.body;
    const logger = init();

    logger.info({ message: `Started validating add hiring payload.` });
    const schema = Joi.object<IHiring>().keys({
      client_name: Joi.string()
        .min(2)
        .pattern(GlobalRegex.CLIENT_NAME)
        .required()
        .messages(ValidationMessages.hiring.client_name),
      client_email: Joi.string()
        .min(5)
        .pattern(Patterns.common.email)
        .required()
        .messages(ValidationMessages.hiring.client_email),
      client_project_name: Joi.string()
        .min(2)
        .max(255)
        .pattern(Patterns.forms.description)
        .required()
        .messages(ValidationMessages.hiring.client_project_name),
      tenure: Joi.number()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER - 1)
        .optional()
        .messages(ValidationMessages.hiring.tenure),
      hiring_type: Joi.string()
        .valid(HiringType.FULL_TIME, HiringType.PART_TIME)
        .required()
        .messages(ValidationMessages.hiring.hiring_type),
      budget: Joi.string().min(1).max(255).required().messages(ValidationMessages.hiring.budget),
      message: Joi.string().min(10).required().messages(ValidationMessages.hiring.message),
      project_desc: Joi.string()
        .min(10)
        .max(255)
        .pattern(Patterns.forms.description)
        .required()
        .messages(ValidationMessages.hiring.project_desc),
      terms: Joi.boolean().required().messages(ValidationMessages.hiring.terms),
      captchaId: Joi.number().required().messages(ValidationMessages.hiring.captchaId),
    });

    const result = schema.validate(payload);

    if (result.error) {
      logger.info({ message: `Failed to validate hiring form's payload.`, error: result.error });

      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = result.error.details[0].message;
      reply.DATA = result.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    if (payload.hiring_type === HiringType.FULL_TIME && payload.tenure) {
      logger.info({
        message: `Failed to validate hiring form's payload due to either hiring type (${payload.hiring_type}) or tenure (${payload.tenure}).`,
      });

      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid tenure and hiring type combination.';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    logger.info({ message: `Successfully validated hiring form's payload.` });
    return next();
  }

  @HandleException()
  public static async validateHiringFormCaptcha(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    const logger = init();
    const REDIS_CLIENT = connectRedis();

    const { captchaId } = request.body;
    const keyName = `portfolio_backend:captcha:${captchaId}`;
    const stringifiedPayload = await REDIS_CLIENT.get(keyName);

    if (!stringifiedPayload) {
      logger.info({
        message: `No captcha id (${captchaId}) was found. Either captcha has expired or captcha id is invalid.`,
      });

      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Form has expired, please submit a fresh form again.';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.FORBIDDEN).json(reply);
    }

    const payload = JSON.parse(stringifiedPayload) as ICaptchaPayload;

    if (!payload.verified) {
      logger.info({ message: `Captcha id (${captchaId}) is not verified yet.` });

      reply.STATUS = Status.ERROR;
      reply.MESSAGE = "You've not proved your identity yet, please prove you're a human.";
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.FORBIDDEN).json(reply);
    }

    return next();
  }
}

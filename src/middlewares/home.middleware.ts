import Joi from 'joi';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { HandleException } from '@decorators/exception.decorator';
import { NextFunction, Request, Response } from 'express';
import { IHome } from '@interfaces/home.interface';
import { ValidationMessages } from '@helpers/messages.helper';
import { init } from '@config/logs.config';

const Patters = require('@book-junction/patterns');

class HomeMiddleWare {
  @HandleException()
  public static addUserHomeMiddleware(request: Request, response: Response, next: NextFunction) {
    const { ...payload } = request.body;
    const reply = new ApiResponse();
    const logger = init();
    let message = `Started validating addUserHomeMiddleware's payload.`;

    logger.info({ message });

    const schema = Joi.object<IHome>().keys({
      displayName: Joi.string()
        .pattern(Patters.common.name)
        .required()
        .messages(ValidationMessages.portfolio.homeSection.displayName),
      url: Joi.string().optional().messages(ValidationMessages.portfolio.homeSection.url),
      about: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages(ValidationMessages.portfolio.homeSection.about),
      specialization: Joi.array()
        .items(Joi.string().required().messages(ValidationMessages.types.string))
        .min(1)
        .messages(ValidationMessages.types.array),
      tags: Joi.array()
        .items(Joi.string().optional().messages(ValidationMessages.types.string))
        .messages(ValidationMessages.types.array),
      projectsDelivered: Joi.number()
        .optional()
        .messages(ValidationMessages.portfolio.homeSection.projectsDelivered),
      activeGithubContributions: Joi.number()
        .optional()
        .messages(ValidationMessages.portfolio.homeSection.activeGithubContributions),
      experience: Joi.number()
        .optional()
        .messages(ValidationMessages.portfolio.homeSection.experience),
      codingQuestionSolved: Joi.number()
        .optional()
        .messages(ValidationMessages.portfolio.homeSection.codingQuestionSolved),
      designation: Joi.string()
        .required()
        .messages(ValidationMessages.portfolio.homeSection.designation),
      linkedInUrl: Joi.string()
        .optional()
        .messages(ValidationMessages.commons.optional.string('LinkedIn url')),
      leetcodeUrl: Joi.string()
        .optional()
        .messages(ValidationMessages.commons.optional.string('Leetcode url')),
      hackerrankUrl: Joi.string()
        .optional()
        .messages(ValidationMessages.commons.optional.string('Hackerrank url')),
      twitterUrl: Joi.string()
        .optional()
        .messages(ValidationMessages.commons.optional.string('Twitter url')),
    });

    const result = schema.validate(payload);

    if (result.error) {
      message = `Failed to validate addUserHomeMiddleware's payload.`;
      logger.info({ message, error: result.error });

      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = result.error.details[0].message;
      reply.DATA = result.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    message = `Successfully validated addUserHomeMiddleware's payload.`;
    logger.info({ message });

    return next();
  }
}

export default HomeMiddleWare;

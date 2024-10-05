import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { IHome, IPortfolio, IProjects } from '../interfaces/portfolio.interface';
import { ValidationMessages } from '../helpers/';
import { ProjectType } from '../constant';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
const Patters = require('@book-junction/patterns');

class PortfolioMiddleware {
  @HandleException()
  public static async createNewPortfolioValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { ...payload } = request.body;
    const reply = new ApiResponse();

    const schema = Joi.object<IPortfolio>().keys({
      homeSection: Joi.object<IHome>().keys({
        profilePic: Joi.string()
          .optional()
          .min(5)
          .max(100)
          .messages(ValidationMessages.portfolio.heroSection.profilePic),
        description: Joi.string()
          .min(5)
          .max(1000)
          .required()
          .messages(ValidationMessages.commons.description),
      }),
      projectSection: Joi.array()
        .items(
          Joi.object<IProjects>().keys({
            name: Joi.string()
              .min(2)
              .max(32)
              .regex(Patters.common.name)
              .required()
              .messages(ValidationMessages.portfolio.projectSection.name),
            description: Joi.string()
              .min(5)
              .max(1000)
              .required()
              .messages(ValidationMessages.commons.description),
            project_type: Joi.string()
              .min(2)
              .regex(/(^personal$|^professional$)/)
              .required()
              .messages(ValidationMessages.portfolio.projectSection.project_type),
            tech_stack: Joi.array()
              .items(
                Joi.string()
                  .min(2)
                  .max(50)
                  .required()
                  .messages(ValidationMessages.portfolio.projectSection.tech_stack)
              )
              .min(1)
              .max(50)
              .required()
              .messages(ValidationMessages.types.array),
            live_link: Joi.string()
              .min(5)
              .max(100)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.live_link),
            documentation_link: Joi.string()
              .min(5)
              .max(100)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.documentation_link),
            code_link: Joi.string()
              .min(5)
              .max(100)
              .when('project_type', {
                is: ProjectType.PERSONAL,
                then: Joi.required(),
                otherwise: Joi.optional(),
              })
              .messages(ValidationMessages.portfolio.projectSection.code_link),
            disabled: Joi.bool()
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.disabled),
          })
        )
        .min(1)
        .messages(ValidationMessages.types.array),
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

  @HandleException()
  public static async updatePortfolioValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { ...payload } = request.body;
    const reply = new ApiResponse();

    const schema = Joi.object<IPortfolio>().keys({
      homeSection: Joi.object<IHome>().keys({
        profilePic: Joi.string()
          .optional()
          .min(5)
          .max(100)
          .messages(ValidationMessages.portfolio.heroSection.profilePic),
        description: Joi.string()
          .min(5)
          .max(1000)
          .required()
          .messages(ValidationMessages.commons.description),
      }),
      projectSection: Joi.array()
        .items(
          Joi.object<IProjects>().keys({
            name: Joi.string()
              .min(2)
              .max(32)
              .regex(Patters.common.name)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.name),
            description: Joi.string()
              .min(5)
              .max(1000)
              .optional()
              .messages(ValidationMessages.commons.description),
            project_type: Joi.string()
              .min(2)
              .regex(/(^personal$|^professional$)/)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.project_type),
            tech_stack: Joi.array()
              .items(
                Joi.string()
                  .min(2)
                  .max(50)
                  .optional()
                  .messages(ValidationMessages.portfolio.projectSection.tech_stack)
              )
              .min(1)
              .max(50)
              .optional()
              .messages(ValidationMessages.types.array),
            live_link: Joi.string()
              .min(5)
              .max(100)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.live_link),
            documentation_link: Joi.string()
              .min(5)
              .max(100)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.documentation_link),
            code_link: Joi.string()
              .min(5)
              .max(100)
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.code_link),
            disabled: Joi.bool()
              .optional()
              .messages(ValidationMessages.portfolio.projectSection.disabled),
          })
        )
        .min(1)
        .messages(ValidationMessages.types.array),
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

export default PortfolioMiddleware;

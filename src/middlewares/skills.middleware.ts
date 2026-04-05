import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { HandleException } from '@decorators/exception.decorator';
import { getTextCount } from '@helpers/index';
import { ValidationMessages } from '@helpers/messages.helper';
import { ISkills } from '@interfaces/portfolio.interface';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

class SkillMiddleware {
  @HandleException()
  public static async createNewSkillValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { ...payload } = request.body;
    const reply = new ApiResponse();

    const schema = Joi.object<ISkills>().keys({
      name: Joi.string()
        .min(2)
        .max(60)
        .required()
        .messages(ValidationMessages.portfolio.skillSection.name),
      experience: Joi.string()
        .required()
        .messages(ValidationMessages.portfolio.skillSection.experience),
      description: Joi.string().required().messages(ValidationMessages.commons.description),
    });

    const validationResult = schema.validate(payload);

    if (validationResult.error) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = validationResult.error.details[0].message;
      reply.DATA = validationResult.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.INV_PAYLOAD).json(reply);
    }

    const charCount = getTextCount(payload.description);

    if (charCount < 10 || charCount > 1000) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Description should be of minimum 10 characters and maximum 1000 characters.';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.INV_PAYLOAD).json(reply);
    }

    return next();
  }
}

export default SkillMiddleware;

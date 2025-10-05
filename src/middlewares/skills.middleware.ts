import { ApiResponse, HTTP_STATUS_CODES, Status } from "@api/index";
import { HandleException } from "@decorators/exception.decorator";
import { ValidationMessages } from "@helpers/messages.helper";
import { ISkills } from "@interfaces/portfolio.interface";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

class SkillMiddleware {
  @HandleException()
  public static async createNewSkillValidator(request: Request, response: Response, next: NextFunction) {
    const { ...payload } = request.body;
    const reply = new ApiResponse();

    const schema = Joi.object<ISkills>().keys({
      name: Joi.string().min(2).max(60).required().messages(ValidationMessages.portfolio.skillSection.name),
      experience: Joi.string().required().messages(ValidationMessages.portfolio.skillSection.experience),
      url: Joi.string().min(5).optional().messages(ValidationMessages.portfolio.skillSection.url),
      description: Joi.string().min(10).max(1000).required().messages(ValidationMessages.commons.description)
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

export default SkillMiddleware;
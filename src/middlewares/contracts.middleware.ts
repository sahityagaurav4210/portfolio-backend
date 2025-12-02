import { NextFunction, Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Contract from '../models/contract.model';
import { init } from '@config/logs.config';
import Joi from 'joi';
import { IContract } from '@interfaces/contract.interface';
import { ValidationMessages } from '@helpers/messages.helper';

const Patterns = require("@book-junction/patterns");
class ContractMiddleware {
  @HandleException()
  public static async checkIfContractAlreadyExists(request: Request, response: Response, next: NextFunction) {
    const reply = new ApiResponse();
    const logger = init();
    const { email } = request.body;

    logger.info({ message: `Started validating the existance of contact for email ${email}.` });
    const contract = await Contract.findOne({ email });

    if (!contract) return next();
    else {
      logger.info({ message: `Found a contact in database for the email ${email}.` });

      reply.STATUS = Status.CONFLICT;
      reply.MESSAGE = "You've already contacted with us.";
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.CONFLICT).json(reply);
    }
  }

  @HandleException()
  public static async addNewContactValidator(request: Request, response: Response, next: NextFunction) {
    const reply = new ApiResponse();
    const logger = init();
    const { ...payload } = request.body;

    logger.info({ message: `Started validating the payload of contact form.` });
    const schema = Joi.object<IContract>().keys({
      first_name: Joi.string().min(2).required().messages(ValidationMessages.contact.first_name),
      last_name: Joi.string().min(2).optional().messages(ValidationMessages.contact.last_name),
      email: Joi.string().pattern(Patterns.common.email).required().messages(ValidationMessages.contact.email),
      message: Joi.string().min(10).required().messages(ValidationMessages.contact.message),
      captchaId: Joi.number().required().messages(ValidationMessages.contact.captchaId)
    });

    const result = schema.validate(payload);

    if (result.error) {
      logger.info({ message: `Failed to validate contact form's payload.`, error: result.error });

      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = result.error.details[0].message;
      reply.DATA = result.error.details[0];
      reply.ENTRY_BY = request.ip || "0.0.0.0";

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    logger.info({ message: `Successfully validated contact form's payload.` });
    return next();
  }
}

export default ContractMiddleware;

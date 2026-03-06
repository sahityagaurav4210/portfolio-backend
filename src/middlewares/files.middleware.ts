import { HandleException } from '@decorators/exception.decorator';
import { IUploadResumeDTO } from '@interfaces/files.interface';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import Patterns from '@book-junction/patterns';
import { ValidationMessages } from '@helpers/messages.helper';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';

class FilesMiddlewares {
  @HandleException()
  public static async uploadResumeValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    const schema = Joi.object<IUploadResumeDTO>().keys({
      websites: Joi.array().items(
        Joi.string()
          .pattern(Patterns.common.url)
          .required()
          .messages(ValidationMessages.resume.websites)
      ),
    });

    const uploadedResume = request.file;
    let websites = request.body.websites;

    if (!uploadedResume || !websites) {
      reply.MESSAGE = 'Api operation was un-successful';
      reply.STATUS = Status.VALIDATION;
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    websites = (websites.split(',') as string[]).map((element: string) => element.trim());
    const result = schema.validate({ websites });

    if (!result.error) return next();

    reply.MESSAGE = 'Api operation was un-successful';
    reply.STATUS = Status.VALIDATION;
    reply.DATA = result.error.details[0].message;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
  }
}

export default FilesMiddlewares;

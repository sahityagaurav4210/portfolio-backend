import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { HandleException } from '@decorators/exception.decorator';
import { decrypt } from '@helpers/index';
import { CustomReq } from '@interfaces/index';
import { User } from '@models/users.model';
import { NextFunction, Response } from 'express';

class PublicMiddlewares {
  @HandleException()
  public static async decryptXuidToken(request: CustomReq, response: Response, next: NextFunction) {
    const token = request.headers['x-xuid'] || request.body.token;
    const reply = new ApiResponse();

    if (!token) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid or missing X-UID token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const decryptedXuid = decrypt(token);
    const user = await User.findById(decryptedXuid);

    if (!user) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'User not found for the provided token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    request.authenticatedUser = user;
    next();
  }
}

export default PublicMiddlewares;

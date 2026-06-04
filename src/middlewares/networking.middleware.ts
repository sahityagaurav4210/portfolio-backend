import RE from 're2';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { HandleException } from '@decorators/exception.decorator';
import { NextFunction, Request, Response } from 'express';
import { GlobalRegex } from '../constant';

class NetworkingMiddleware {
  @HandleException()
  public static async validatefetchIpLocReq(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    const clientIp = request.query.clientIp as string;

    if (!clientIp) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid client ip';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    if (clientIp === '127.0.0.1' || clientIp === 'localhost') {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid client ip, localhost detected';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    if (
      new RE(GlobalRegex.CLASS_A_IP).test(clientIp) ||
      new RE(GlobalRegex.CLASS_B_IP).test(clientIp) ||
      new RE(GlobalRegex.CLASS_C_IP).test(clientIp)
    ) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid client ip, private ip detected';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    return next();
  }
}

export default NetworkingMiddleware;

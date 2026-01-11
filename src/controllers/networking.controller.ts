import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { HandleException } from '@decorators/exception.decorator';
import { Request, Response } from 'express';
import geo from 'geoip-lite';

class NetworkingController {
  @HandleException()
  public static async fetchIpLocDetails(request: Request, response: Response) {
    const reply = new ApiResponse();
    const { clientIp } = request.query || {};

    if (!clientIp) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid client ip';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const details = geo.lookup(clientIp as string);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'IP location details fetched successfully';
    reply.DATA = details;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default NetworkingController;

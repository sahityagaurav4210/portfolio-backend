import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Contract from '../models/contract.model';

class ContractController {
  @HandleException()
  public static async create(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const payload = { ...request.body, ipAddress: request.ip || '0.0.0.0' };

    const contractRecord = await Contract.create(payload);

    if (contractRecord) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Contract added successfully';
      reply.DATA = contractRecord;
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }

  @HandleException()
  public static async list(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const contracts = await Contract.find({});

    if (contracts.length) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Contracts fetched successfully';
      reply.DATA = contracts;
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    } else {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'No contracts found!!';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    }
  }
}

export default ContractController;

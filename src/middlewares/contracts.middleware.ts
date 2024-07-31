import { NextFunction, Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Contract from '../models/contract.model';

class ContractMiddleware {
  @HandleException()
  public static async checkIfContractAlreadyExists(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const reply = new ApiResponse();
    const { email } = request.body;

    const contract = await Contract.findOne({ email });

    if (!contract) return next();
    else {
      reply.STATUS = Status.CONFLICT;
      reply.MESSAGE = "You've already contracted with us";
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.CONFLICT).json(reply);
    }
  }
}

export default ContractMiddleware;

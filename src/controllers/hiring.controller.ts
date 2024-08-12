import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Hiring } from '../models/hiring.model';

class HiringController {
  @HandleException()
  public static async add(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();

    const newHireRecord = await Hiring.create({ ...request.body, ipAddress: request.ip });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Form submitted successfully';
    reply.DATA = newHireRecord;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async list(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();

    const hiringRecords = await Hiring.find({});

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Forms fetched successfully';
    reply.DATA = hiringRecords;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async delete(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { hiringId } = request.params;

    const deletedRecord = await Hiring.findByIdAndDelete(hiringId, { new: true });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Form deleted successfully';
    reply.DATA = deletedRecord;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HiringController;

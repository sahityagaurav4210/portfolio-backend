import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Hiring } from '../models/hiring.model';
import { init } from '@config/logs.config';
import { CustomReq } from '@interfaces/index';

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

    const hiringRecords = await Hiring.find({
      $or: [{ isDeleted: false }, { isDeleted: null }],
    }).lean();

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Forms fetched successfully';
    reply.DATA = hiringRecords;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async delete(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();
    const { hiringId } = request.params;
    const { phone } = request.authenticatedUser || {};

    const deletedRecord = await Hiring.findByIdAndDelete(hiringId, { new: true });
    logger.info({
      message: `Hiring record - ${hiringId} has been deleted by user - ${phone}`,
      deleteType: 'permanent',
    });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Form deleted successfully';
    reply.DATA = deletedRecord;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async softDelete(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();
    const { hiringId } = request.params;
    const { phone } = request.authenticatedUser || {};

    const deletedRecord = await Hiring.findByIdAndUpdate(hiringId, { $set: { isDeleted: true } });
    logger.info({
      message: `Hiring record - ${hiringId} has been deleted by user - ${phone}`,
      deleteType: 'soft',
    });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Form deleted successfully';
    reply.DATA = deletedRecord;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HiringController;

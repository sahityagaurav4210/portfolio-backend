import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Contract from '../models/contract.model';
import { init } from '@config/logs.config';
import { performParallelTask } from '@helpers/index';
import { Events } from '@models/events.model';
import { EventNames } from '../constant';

class ContractController {
  @HandleException()
  public static async create(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();
    const payload = { ...request.body, ipAddress: request.ip || '0.0.0.0' };
    const identity = request.ip || '0.0.0.0';

    const [contractRecord] = await performParallelTask([
      Contract.create(payload),
      Events.create({ eventName: EventNames.CONTACT_FORM_FILLED, firedBy: identity }),
    ]);

    if (contractRecord) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Contract added successfully';
      reply.DATA = contractRecord;
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({ message: `A new contact created by ${request.ip || '0.0.0.0'}` });
      return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({ message: `Failed to create a contact, identity ${request.ip || '0.0.0.0'}` });
      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }

  @HandleException()
  public static async list(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const contracts = await Contract.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).lean(true);

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

  @HandleException()
  public static async delete(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const contactId = request.params.contactId;
    const identity = request.ip || '0.0.0.0';

    if (!contactId) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Contract id is required in params to delete a contact form.';
      reply.ENTRY_BY = identity;

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    await performParallelTask([
      Contract.findOneAndUpdate(
        { _id: contactId },
        { isActive: false, updatedAt: new Date() },
        { new: true, runValidators: true }
      ),
      Events.create({
        eventName: EventNames.CONTACT_FORM_DELETED,
        firedBy: identity,
      }),
    ]);

    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }
}

export default ContractController;

import { Response } from 'express';
import { CustomReq } from '../interfaces';
import { User } from '../models/users.model';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';

class UserController {
  @HandleException()
  public static async editProfile(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const reply = new ApiResponse();

    const updatedUserRecord = await User.findByIdAndUpdate(authenticatedUser?._id, request.body, {
      new: true,
      runValidators: true,
    });

    if (updatedUserRecord) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Profile updated';
      reply.DATA = updatedUserRecord;
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.UPDATED).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'An error occurred, please try again after sometime';
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }

  @HandleException()
  public static async viewProfile(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const reply = new ApiResponse();

    const profile = await User.findById(authenticatedUser?._id);

    if (profile) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Profile fetched successfully';
      reply.DATA = profile;
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UPDATED).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'An error occurred, please try again after sometime';
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }
}

export default UserController;

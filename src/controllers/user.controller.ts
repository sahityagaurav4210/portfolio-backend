import { Response } from 'express';
import { CustomReq } from '../interfaces';
import { User } from '../models/users.model';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import { checkPwd } from '@helpers/index';

class UserController {
  @HandleException()
  public static async editProfile(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const { password, phone, ...payload } = request.body;
    const reply = new ApiResponse();
    const avatar = request.file ? `/assets/${request.file.filename}` : undefined;

    if (avatar) {
      payload.avatar = avatar;
    }

    if (payload.websites) {
      payload.websites = payload.websites.split(',').map((url: string) => url.trim());
    }

    const updatedUserRecord = await User.findByIdAndUpdate(
      authenticatedUser?._id,
      { $set: { ...payload, updatedAt: new Date() } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedUserRecord) {
      return response.status(HTTP_STATUS_CODES.NO_CONTENT).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'An error occurred, please try again after sometime';
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }

  @HandleException()
  public static async changePwd(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { oldPwd, newPwd } = request.body;
    const { _id, phone } = request.authenticatedUser || {};
    const identity = phone || request.ip || '0.0.0.0';

    const user = await User.findById(_id, { password: 1 });

    if (!user) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'Invalid user';
      reply.ENTRY_BY = identity;

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    if (!(await checkPwd(oldPwd, user.password))) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid password';
      reply.ENTRY_BY = identity;

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    user.password = newPwd;
    user.updatedAt = new Date();

    await user.save();
    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async viewProfile(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const reply = new ApiResponse();

    const profile = await User.findById(
      authenticatedUser?._id,
      { createdAt: 0, updatedAt: 0, __v: 0, tokens: 0 },
      { lean: true }
    );

    if (profile) {
      const websites = profile.websites?.join(',') || '';

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Profile fetched successfully';
      reply.DATA = { ...profile, websites };
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'An error occurred, please try again after sometime';
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
  }
}

export default UserController;

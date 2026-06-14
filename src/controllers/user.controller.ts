import { Response } from 'express';
import { CustomReq } from '../interfaces';
import { User } from '../models/users.model';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import {
  checkPwd,
  encrypt,
  getChangePwdLink,
  getRandomSecureString,
  getSafeEditProfilePayload,
  getUpdatedProfileLink,
} from '@helpers/index';
import { RedisConstants } from '../constant';
import connectRedis from '@config/redis.config';

class UserController {
  @HandleException()
  public static async editProfile(request: CustomReq, response: Response): Promise<Response> {
    const REDIS_CLIENT = connectRedis();
    const reply = new ApiResponse();
    const { authenticatedUser } = request;
    const { password, phone, ...payload } = request.body;
    const avatar = request.file ? `/assets/${request.file.filename}` : undefined;
    const userId = authenticatedUser?._id?.toString();
    const safePayload = getSafeEditProfilePayload(payload);

    if (avatar) {
      safePayload.avatar = avatar;
    }

    if (safePayload.websites) {
      safePayload.websites = safePayload.websites.split(',').map((url: string) => url.trim());
    }

    const updatedUserRecord = await User.findByIdAndUpdate(
      userId,
      { $set: { ...safePayload, updatedAt: new Date() } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedUserRecord?.email) {
      const profileAuthorizer = getRandomSecureString(16);
      const changePwdAuthorizer = getRandomSecureString(16);
      const appEnvironment = process.env.APP_ENV || 'local';
      const profileLink = `${getUpdatedProfileLink(appEnvironment)}?xuid=${encrypt(userId)}&authorizer=${profileAuthorizer}`;
      const link = `${getChangePwdLink(appEnvironment)}?xuid=${encrypt(userId)}&authorizer=${changePwdAuthorizer}`;
      const supportUrl = 'mailto:' + process.env.SUPPORT_EMAIL;
      const xuidAuthorizerKey = `${RedisConstants.XUID_TOKEN_PREFIX}:${userId}`;
      const xuidProfileAuthorizerKey = `${RedisConstants.XUID_PROFILE_AUTHORIZER_PREFIX}:${userId}`;
      const payload = {
        content: {
          email: authenticatedUser.email,
          link,
          profileLink,
          supportUrl,
          subject: `Profile update detected for user having phone number ${authenticatedUser.phone} at ${new Date().toLocaleString('hi-In')}.`,
          userName: authenticatedUser.name,
        },
        timestamp: new Date().toLocaleString('hi-In'),
      };

      await Promise.all([
        REDIS_CLIENT.setex(xuidAuthorizerKey, 10 * 60, changePwdAuthorizer),
        REDIS_CLIENT.setex(xuidProfileAuthorizerKey, 10 * 60, profileAuthorizer),
        REDIS_CLIENT.publish(RedisConstants.PROFILE_UPDATE_CHANNEL_NAME, JSON.stringify(payload)),
      ]);
    }

    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json(reply);
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
      const { phone, password, ...payload } = profile;

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Profile fetched successfully';
      reply.DATA = { ...payload, websites };
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

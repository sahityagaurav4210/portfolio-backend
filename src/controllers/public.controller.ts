import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import connectRedis from '@config/redis.config';
import { HandleException } from '@decorators/exception.decorator';
import { CustomReq } from '@interfaces/index';
import { Response } from 'express';
import { RedisConstants } from '../constant';
import { User } from '@models/users.model';
import { checkPwd, decrypt } from '@helpers/index';
import UserConfiguration from '@models/users_config.model';
import { Login } from '@models/login.model';

class PublicController {
  @HandleException()
  public static async checkXuidToken(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const authorizer = request.headers['x-xuid-authorizer'] as string;
    const xuid = request.headers['x-xuid'] as string;

    const userId = decrypt(xuid);
    const redisKey = `${RedisConstants.XUID_TOKEN_PREFIX}:${userId}`;
    const storedAuthorizer = await REDIS_CLIENT.get(redisKey);

    if (authorizer !== storedAuthorizer) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid authorizer';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Verified';
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async publicChangePwd(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const userId = request.authenticatedUser._id;

    const { oldPwd, newPwd } = request.body;
    const user = await User.findOne({ _id: userId }, { password: 1 });

    if (!user) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'No user found for the provided token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    if (!(await checkPwd(oldPwd, user.password))) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid password';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    user.password = newPwd;
    user.updatedAt = new Date();

    await user.save();
    const updatedUserLoginRecord = await Login.findOne({ loggedInUser: user._id });
    const currentActiveAccessToken = updatedUserLoginRecord?.sessions.at(-1)?.access_token;

    if (!currentActiveAccessToken) {
      reply.STATUS = Status.UNDEFINED;
      reply.MESSAGE = 'Sorry, we could not process your request due to some corrupted data';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }

    if (!updatedUserLoginRecord) {
      reply.STATUS = Status.UNDEFINED;
      reply.MESSAGE = 'Sorry, we could not process your request due to some corrupted data';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }

    const loggedInUserFlagKey = `${RedisConstants.LOGGED_IN_USER_FLAG}:${currentActiveAccessToken}`;
    const pwdChangedFlagKey = `${RedisConstants.PWD_CHANGED_FLAG}:${updatedUserLoginRecord.sessions.at(-1)?.token}`;

    updatedUserLoginRecord.sessions.at(-1)!.logoutAt = new Date();
    updatedUserLoginRecord.sessions.at(-1)!.isLoggedIn = false;
    updatedUserLoginRecord.updatedAt = new Date();

    await updatedUserLoginRecord.save();
    await REDIS_CLIENT.del(loggedInUserFlagKey);
    await REDIS_CLIENT.set(pwdChangedFlagKey, 'true');
    await UserConfiguration.findOneAndUpdate(
      { userId },
      {
        $set: { modifiedBy: userId, hasPwdChangedRecently: true, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, runValidators: true, new: true }
    );

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Password updated successfully';
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default PublicController;

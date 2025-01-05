import { Response } from 'express';
import { Login } from '../models/login.model';
import { generateToken } from '../helpers';
import { Tokens } from '../constant';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';
import { modelUpdateObject } from '../config/db_models.config';

class LoginController {
  @HandleException()
  public static async login(request: CustomReq, response: Response): Promise<Response> {
    const { phone } = request.body;
    let { loginRecord, userRecord } = request;
    const reply = new ApiResponse();

    const access_token = generateToken(phone, Tokens.ACCESS);
    const refresh_token = generateToken(phone, Tokens.REFRESH);
    const signins = { token: refresh_token, isLoggedIn: true, loginAt: new Date() };

    if (loginRecord) {
      loginRecord.signins.push(signins);
      loginRecord.updatedAt = new Date();

      await loginRecord.save();
    } else {
      loginRecord = await Login.create({
        phone,
        loggedInUser: userRecord,
        signins: [signins],
      });
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Login successfull';
    reply.DATA = { access_token, refresh_token, phone };
    reply.ENTRY_BY = phone;

    response.cookie('authorization', access_token, { httpOnly: true, secure: true });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async logout(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    let { refreshtoken, authorization } = request.headers;
    const reply = new ApiResponse();

    const { _id } = authenticatedUser;
    authorization = authorization?.split("Bearer ")[1];
    const { REDIS_CLIENT } = globalThis as Record<string, any>;
    const user = await Login.findOneAndUpdate({ loggedInUser: _id, "signins.token": refreshtoken }, { $set: { "signins.$.logoutAt": new Date(), "signins.$.isLoggedIn": false } }, modelUpdateObject());

    if (user) {
      await REDIS_CLIENT.del(`portfolio-backend:auth:${authorization}`);

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Logout successfull';
      reply.DATA = user;
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    } else {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid user';
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.OK).json(reply);
    }
  }
}

export default LoginController;

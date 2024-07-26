import { Response } from 'express';
import { Login } from '../models/login.model';
import { generateToken } from '../helpers';
import { Tokens } from '../constant';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';

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
    const { refreshtoken } = request.headers;
    const reply = new ApiResponse();

    const { _id } = authenticatedUser;
    const user = await Login.findOne({ loggedInUser: _id });

    if (user) {
      for (let index = 0; index < user.signins.length; index++) {
        if (user.signins[index].token === refreshtoken) {
          user.signins[index].logoutAt = new Date();
          user.signins[index].isLoggedIn = false;
          break;
        }
      }
      await user?.save();

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

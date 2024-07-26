import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { generateToken, generateXApiToken } from '../helpers';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';
import { CLIENT_URL, Tokens } from '../constant';
import { Login } from '../models/login.model';

class TokenController {
  @HandleException()
  public static async createClientToken(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const x_api_key = generateXApiToken(CLIENT_URL);
    const reply = new ApiResponse(
      Status.SUCCESS,
      'Client token generated',
      { token: x_api_key },
      authenticatedUser.phone
    );

    response.cookie('x_api_key', x_api_key, { httpOnly: true, secure: true });
    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async refreshToken(request: Request, response: Response): Promise<Response> {
    const { refreshtoken } = request.headers;
    const reply = new ApiResponse();

    const user = await Login.findOne({ 'signins.token': refreshtoken });

    if (user) {
      const access_token = generateToken(user.phone, Tokens.ACCESS);

      response.cookie('authorization', access_token, { httpOnly: true, secure: true });

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Access token generated';
      reply.DATA = { access_token };
      reply.ENTRY_BY = user.phone;

      return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
    } else {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }
  }

  @HandleException()
  public static async refreshClientToken(request: Request, response: Response): Promise<Response> {
    const x_api_key = generateXApiToken(CLIENT_URL);
    const reply = new ApiResponse();

    response.cookie('x_api_key', x_api_key, { httpOnly: true, secure: true });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Client token generated';
    reply.DATA = { token: x_api_key };

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }
}

export default TokenController;

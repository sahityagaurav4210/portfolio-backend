import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { generateToken, generateXApiToken, performParallelTask } from '../helpers';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { CustomReq } from '../interfaces';
import { CLIENT_URL, EventNames, Tokens } from '../constant';
import { Login } from '../models/login.model';
import { Events } from '../models/events.model';
import { User } from '../models/users.model';

class TokenController {
  @HandleException()
  public static async createClientToken(request: CustomReq, response: Response): Promise<Response> {
    const { authenticatedUser } = request;
    const { url } = request.body;
    const x_api_key = generateXApiToken(url);
    const reply = new ApiResponse(
      Status.SUCCESS,
      'Client token generated',
      { token: x_api_key },
      authenticatedUser.phone || request.ip || '0.0.0.0'
    );
    const user = await User.findOne({ websites: url });

    if (user) {
      reply.STATUS = Status.CONFLICT;
      reply.MESSAGE = 'Client token already generated';
      reply.ENTRY_BY = authenticatedUser.phone || request.ip || '';
      reply.DATA = null;

      return response.status(HTTP_STATUS_CODES.CONFLICT).json(reply);
    }

    await performParallelTask([
      User.findByIdAndUpdate(authenticatedUser._id, { $push: { websites: url } }),
      Events.create({
        eventName: EventNames.CLIENT_ACCESS_TOKEN_GEN,
        firedBy: authenticatedUser._id,
      }),
    ]);

    response.cookie('x_api_key', x_api_key, { httpOnly: true, secure: true });
    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async refreshToken(request: CustomReq, response: Response): Promise<Response> {
    const refreshtoken = request.headers['x-ref-token'];
    const { authenticatedUser } = request;
    const reply = new ApiResponse();

    const user = await Login.findOne({ 'sessions.token': refreshtoken });

    if (user) {
      const access_token = generateToken(user.phone, Tokens.ACCESS);

      await performParallelTask([Login.findOneAndUpdate({ 'sessions.token': refreshtoken }, { 'sessions.$.access_token': access_token }, { runValidators: true }), Events.create({
        eventName: EventNames.ACCESS_TOKEN_REFRESHED,
        firedBy: authenticatedUser._id,
      })]);

      response.cookie('authorization', access_token, { httpOnly: true, secure: true });

      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Access token generated';
      reply.DATA = { access_token };
      reply.ENTRY_BY = user.phone;

      return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
    } else {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid token';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }
  }

  @HandleException()
  public static async refreshClientToken(request: Request, response: Response): Promise<Response> {
    const { url } = request.body;
    const x_api_key = generateXApiToken(url);
    const reply = new ApiResponse();

    response.cookie('x_api_key', x_api_key, { httpOnly: true, secure: true });
    await Events.create({
      eventName: EventNames.CLIENT_ACCESS_TOKEN_REGEN,
      firedBy: request.ip || '0.0.0.0',
    });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Client token generated';
    reply.DATA = { token: x_api_key };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }
}

export default TokenController;

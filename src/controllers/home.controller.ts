import { Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Events } from '../models/events.model';
import { EventNames } from '../constant';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';

class HomeController {
  @HandleException()
  public static ping(request: Request, response: Response): Response {
    const reply = new ApiResponse(
      Status.SUCCESS,
      'Pong',
      { version: 'v1' },
      request.ip || 'localhost'
    );

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async shutdown(request: CustomReq, response: Response): Promise<void> {
    const { authenticatedUser } = request;
    const reply = new ApiResponse(Status.SUCCESS, 'Shutdown was successfull');

    await Events.create({ eventName: EventNames.SHUT_DOWN, firedBy: authenticatedUser._id });
    response.status(HTTP_STATUS_CODES.OK).json(reply);
    process.exit(0);
  }
}

export default HomeController;

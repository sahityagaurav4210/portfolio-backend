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

  @HandleException()
  public static async captcha(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const alphaNumericLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaLen = 5;
    let degrees = ['rotate45', '-rotate45', 'rotate12', '-rotate12', 'rotate90'];
    const captchaArray = [];

    for (let index = 0; index < Number(captchaLen); index++) {
      captchaArray.push({
        letter: alphaNumericLetters[Math.floor(Math.random() * alphaNumericLetters.length)],
        degree: degrees[Math.floor(Math.random() * degrees.length)],
      });
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha generated';
    reply.DATA = captchaArray;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }
}

export default HomeController;

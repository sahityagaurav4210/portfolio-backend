import { Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Events } from '../models/events.model';
import { EventNames } from '../constant';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';
import { decrypt, encrypt } from '../helpers';

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
    let captcha = '';
    let degrees = ['rotate-45', '-rotate-45', 'rotate-12', '-rotate-12', 'rotate-90'];
    const captchaArray = [];

    for (let index = 0; index < Number(captchaLen); index++) {
      captcha += alphaNumericLetters[Math.floor(Math.random() * alphaNumericLetters.length)];
      captchaArray.push({
        letter: captcha[index],
        degree: degrees[Math.floor(Math.random() * degrees.length)],
      });
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha generated';
    reply.DATA = { captchaArray, captcha, token: encrypt(captcha) };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async captchaValidate(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    let { captcha, captchaToken } = request.query;

    captchaToken = captchaToken as string;
    captcha = captcha as string;

    const decryptedCaptcha = decrypt(captchaToken);

    if (decryptedCaptcha !== captcha) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid captcha';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha verified';
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HomeController;

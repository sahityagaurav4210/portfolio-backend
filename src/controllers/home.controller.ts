import { Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Events } from '../models/events.model';
import { EventNames } from '../constant';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq } from '../interfaces';
import { decrypt, encrypt, performParallelTask } from '../helpers';
import { WebsiteUpdates } from '../models/website_updates';
import Queries from '../db/queries';
import connectRedis from '@config/redis.config';

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

  @HandleException()
  public static async updateWebsite(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const websiteOwner = request.authenticatedUser._id;

    const updatedWebsiteRecord = await WebsiteUpdates.findOneAndUpdate(
      { website_owner: websiteOwner },
      { $set: { updatedAt: new Date(Date.now()), portfolio_url: request.body.portfolio_url } },
      { runValidators: true, new: true, upsert: true }
    );

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Website updated successfully';
    reply.DATA = updatedWebsiteRecord;
    reply.ENTRY_BY = request.authenticatedUser.email || request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.UPDATED).json(reply);
  }

  @HandleException()
  public static async getLastModifiedDate(
    request: CustomReq,
    response: Response
  ): Promise<Response> {
    const reply = new ApiResponse();
    const { portfolio_url } = request.query;

    if (!portfolio_url) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'All fields are required';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const websiteRecord = await WebsiteUpdates.findOne({ portfolio_url }).select('updatedAt');

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Website updated successfully';
    reply.DATA = { lastModifiedAt: websiteRecord?.updatedAt };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async updateWebsiteAccess(
    request: CustomReq,
    response: Response
  ): Promise<Response> {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const cachedWebViewEventKey = 'portfolio-backend:events:website-view-event';
    const cachedWebViewEvents = JSON.parse(
      (await REDIS_CLIENT.get(cachedWebViewEventKey)) || JSON.stringify({})
    ) as Array<Record<string, any>>;
    const payload = [
      {
        eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED,
        firedBy: request.ip || '0.0.0.0',
      },
    ];

    if (!cachedWebViewEvents || !cachedWebViewEvents?.length) {
      await REDIS_CLIENT.set(cachedWebViewEventKey, JSON.stringify(payload));
    } else {
      cachedWebViewEvents.push(payload[0]);
      await REDIS_CLIENT.set(cachedWebViewEventKey, JSON.stringify(cachedWebViewEvents));
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Event created successfully';
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async getWebsiteAccess(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const eventName = EventNames.PORTFOLIO_WEBSITE_TOTAL_VIEWS_FETCHED;
    let [views] = await performParallelTask([
      Events.find({ eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED }),
      Events.create({ eventName, firedBy: request.ip }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Events fetched successfully';
    reply.DATA = { views, view_count: views.length };
    reply.ENTRY_BY = request.ip || '';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async getDailyWebsiteViews(
    request: CustomReq,
    response: Response
  ): Promise<Response> {
    const reply = new ApiResponse();
    const eventName = EventNames.PORTFOLIO_WEBSITE_VIEW_FETCHED;
    let [views] = await performParallelTask([
      Events.aggregate(Queries.getDailyWebsiteViews(new Date())),
      Events.create({ eventName, firedBy: request.ip }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Events fetched successfully';
    reply.DATA = views[0] || { view_count: 0 };
    reply.ENTRY_BY = request.ip || '';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HomeController;

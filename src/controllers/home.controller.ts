import { Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { Events } from '../models/events.model';
import { EventNames } from '../constant';
import { HandleException } from '../decorators/exception.decorator';
import { CustomReq, ICaptchaValidate } from '../interfaces';
import { decrypt, encrypt, performParallelTask } from '../helpers';
import { WebsiteUpdates } from '../models/website_updates';
import Queries from '../db/queries';
import connectRedis from '@config/redis.config';
import { PageStatus } from '@models/page_status.model';
import { init } from '@config/logs.config';
import Home from '@models/home.model';
import sharp from 'sharp';

import * as svgCaptcha from "svg-captcha";
import { ICaptchaPayload } from '@interfaces/captcha.interface';
import { getCaptchaImgConfig } from '@config/captcha.config';
class HomeController {
  private static async convertSvgIntoPng(svgData: string): Promise<Buffer> {
    const buffer = await sharp(Buffer.from(svgData)).resize(200, 50).png().toBuffer();
    return buffer;
  }

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
    const REDIS_CLIENT = connectRedis();
    let captchaLen = Number(process.env.CAPTCHA_LEN) || 6;
    const svgMetadata = svgCaptcha.create(getCaptchaImgConfig(captchaLen));
    let captcha = svgMetadata.text;
    const keyName = "portfolio_backend:captcha";
    const timeout = Number(process.env.CAPTCHA_TIMEOUT) * 60;
    const logger = init();

    const captchaId = Date.now();
    const token = await encrypt(captcha);
    const payload = { token, data: svgMetadata.data, verified: false };
    await REDIS_CLIENT.setex(`${keyName}:${captchaId}`, timeout, JSON.stringify(payload));

    logger.info({ message: `Captcha - ${captcha} has been generated at ${new Date().toISOString()} by ${request.ip || "0.0.0.0"}` });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha generated';
    reply.DATA = { url: `/captcha/${captchaId}`, captchaId };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async getCaptchaImg(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const { captchaId } = request.params;
    const keyName = `portfolio_backend:captcha:${captchaId}`;

    const stringifiedPayload = await REDIS_CLIENT.get(keyName);

    if (!stringifiedPayload) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid captcha details!!!';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const payload = JSON.parse(stringifiedPayload);
    return response.send(await HomeController.convertSvgIntoPng(payload.data));
  }

  @HandleException()
  public static async refreshCaptcha(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const REDIS_CLIENT = connectRedis();
    const { captchaId } = request.query as unknown as Record<string, any>;
    let captchaLen = Number(process.env.CAPTCHA_LEN) || 6;
    const timeout = Number(process.env.CAPTCHA_TIMEOUT) * 60;
    const svgMetadata = svgCaptcha.create(getCaptchaImgConfig(captchaLen));
    let captcha = svgMetadata.text;
    const keyName = "portfolio_backend:captcha";
    const logger = init();

    await REDIS_CLIENT.del(`${keyName}:${captchaId}`);
    logger.info({ message: `Captcha - ${captcha} with captcha id - ${captchaId} has been deleted successfully at ${new Date().toISOString()} by ${request.ip || "0.0.0.0"}` });

    const token = await encrypt(captcha);
    const payload = { token, data: svgMetadata.data, verified: false };
    await REDIS_CLIENT.setex(`${keyName}:${captchaId}`, timeout, JSON.stringify(payload));

    logger.info({ message: `Captcha - ${captcha} has been re-generated at ${new Date().toISOString()} by ${request.ip || "0.0.0.0"}` });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha generated';
    reply.DATA = { url: `/captcha/${captchaId}`, captchaId };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async captchaValidate(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    let { captcha, captchaId } = request.query as unknown as ICaptchaValidate;
    const REDIS_CLIENT = connectRedis();
    const logger = init();
    const keyName = `portfolio_backend:captcha:${captchaId}`;
    const timeout = Number(process.env.CAPTCHA_TIMEOUT) * 60;
    const stringifiedPayload = await REDIS_CLIENT.get(keyName);

    if (!stringifiedPayload) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid captcha details';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({ message: `There's something went wrong with payload of provided captchaId - ${captchaId}.` });
      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    const payload = JSON.parse(stringifiedPayload) as ICaptchaPayload;
    const decryptedCaptcha = await decrypt(payload.token);

    if (decryptedCaptcha !== captcha) {
      reply.STATUS = Status.UNAUTHORISED;
      reply.MESSAGE = 'Invalid captcha';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      logger.info({ message: `Provided captcha does not match with the one which has been generated by the system, please check the typos in captcha provided.` });
      return response.status(HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }

    await REDIS_CLIENT.setex(keyName, timeout, JSON.stringify({ ...payload, verified: true }));
    logger.info({ message: `Captcha - ${captcha} has been successfully verified by the system.` });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Captcha verified';
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async listPageStatus(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const url = request.query.url;
    const query = url ? { url } : {};
    const pageStatusRecords = await PageStatus.find(query, { url: 1, status: 1 }, { lean: true });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Page status fetched successfully";
    reply.DATA = pageStatusRecords;
    reply.ENTRY_BY = request.ip || "0.0.0.0";

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static notFound(request: Request, response: Response): Response {
    const reply = new ApiResponse();

    reply.STATUS = Status.NOT_FOUND;
    reply.MESSAGE = "This route does not exists";
    reply.ENTRY_BY = request.ip || "0.0.0.0";

    return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
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
      Events.aggregate(Queries.getTotalViews()),
      Events.create({ eventName, firedBy: request.ip }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Events fetched successfully';
    reply.DATA = views[0] || {};
    reply.ENTRY_BY = request.ip || '';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async getMonthlyWebViews(
    request: CustomReq,
    response: Response
  ): Promise<Response> {
    const reply = new ApiResponse();
    const eventName = EventNames.PORTFOLIO_WEBSITE_MONTHLY_VIEWS_FETCHED;
    let [views] = await performParallelTask([
      Events.aggregate(Queries.getMonthlyWebsiteViews(new Date())),
      Events.create({ eventName, firedBy: request.ip }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Events fetched successfully';
    reply.DATA = views[0] || { view_count: 0 };
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

  @HandleException()
  public static async getTodayViewsDetails(
    request: Request,
    response: Response
  ): Promise<Response> {
    const reply = new ApiResponse();

    const currentDate = new Date();
    const todayDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
    const nextDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate() + 1
      }`;
    const viewDetails = await Events.find({
      $and: [
        { eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED },
        {
          createdAt: {
            $lte: new Date(nextDate),
            $gte: new Date(todayDate),
          },
        },
      ],
    });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Details fetched successfully';
    reply.DATA = viewDetails;
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async addUserHomeSection(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();

    const { _id: user, phone } = request.authenticatedUser;
    let { ...payload } = request.body;
    payload = { ...payload, user };

    logger.info({ message: `Started inserting the home section of user - ${user}.` });
    await Home.updateOne({ user }, { $set: { ...payload, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { runValidators: true, upsert: true, setDefaultsOnInsert: true });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Home section added successfully";
    reply.DATA = payload;
    reply.ENTRY_BY = request.ip || phone || "0.0.0.0";

    logger.info({ message: `Successfully upserted the home section of user - ${user}` });
    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async getUserHomeSection(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();

    const { _id: user, phone } = request.authenticatedUser;
    const homeSection = await Home.findOne({ user }, { createdAt: 0, updatedAt: 0 }, { lean: true });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Home section fetched successfully";
    reply.DATA = homeSection;
    reply.ENTRY_BY = request.ip || phone || "0.0.0.0";

    logger.info({ message: `Home section of user - ${user} has been successfully fetched by a request bearing identity - ${request.ip}` });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HomeController;

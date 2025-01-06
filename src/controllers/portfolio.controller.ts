import { Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Portfolio from '../models/portfolio.model';
import { CustomReq } from '../interfaces';
import { EventNames } from '../constant';
import { Convert } from '../helpers/convertibles.helper';
import Queries from '../db/queries';
import { Events } from '../models/events.model';
import { modelUpdateObject } from '../config/db_models.config';

class PortfolioController {
  @HandleException()
  public static async create(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;
    let portfolio, code: number;

    request.body.portfolio_user = authenticatedUser._id;
    [portfolio] = await Promise.allSettled([
      Portfolio.create(request.body),
      Events.create({ eventName: EventNames.PORTFOLIO_CREATED, firedBy: authenticatedUser._id }),
    ]);

    if (portfolio.status === 'fulfilled') {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Portfolio created successfully';
      reply.DATA = portfolio;
      code = HTTP_STATUS_CODES.CREATED;
    } else {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      code = HTTP_STATUS_CODES.SERVER_ERR;
    }

    reply.ENTRY_BY = authenticatedUser.phone;
    return response.status(code).json(reply);
  }

  @HandleException()
  public static async list(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;
    let portfolios, code: number;

    [portfolios] = await Promise.allSettled([
      Portfolio.aggregate(Queries.listPortfolio()),
      Events.create({
        eventName: EventNames.ALL_PORTFOLIO_FETCHED,
        firedBy: authenticatedUser._id,
      }),
    ]);

    if (portfolios.status === 'fulfilled') {
      portfolios = portfolios.value as Array<Record<string, any>>;
      code = HTTP_STATUS_CODES.OK;
      reply.STATUS = Status.SUCCESS;
      reply.DATA = portfolios;
      reply.MESSAGE = 'Portfolio list fetched successfully';
    } else {
      code = HTTP_STATUS_CODES.SERVER_ERR;
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
    }

    reply.ENTRY_BY = authenticatedUser?.phone || request.ip || '0.0.0.0';
    return response.status(code).json(reply);
  }

  @HandleException()
  public static async get(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { portfolio_user } = request.params;
    const { authenticatedUser } = request;
    const { REDIS_CLIENT } = globalThis as Record<string, any>;

    const eventName = EventNames.SINGLE_PORTFOLIO_FETCHED.replace(
      ':portfolio_user',
      portfolio_user
    );
    let portfolio,
      code: number,
      cachedPortfolioExp = (Number(process.env.CACHED_PORTFOLIO_EXPIRY) || 0.25) * 60;
    const cachedPortfolioKey = `portfolio-backend:portfolios:${portfolio_user}`;
    const cachedPortfolio = await REDIS_CLIENT.get(cachedPortfolioKey);

    if (cachedPortfolio) {
      reply.STATUS = Status.SUCCESS;
      reply.DATA = JSON.parse(cachedPortfolio)[0] || {};
      reply.MESSAGE = 'Portfolio list fetched successfully';
      code = HTTP_STATUS_CODES.OK;
    } else {
      [portfolio] = await Promise.allSettled([
        Portfolio.aggregate([
          {
            $match: {
              portfolio_user: Convert.toObjectId(portfolio_user),
            },
          },
          ...Queries.listPortfolio(),
        ]),
        await Events.create({ eventName, firedBy: authenticatedUser._id }),
      ]);

      if (portfolio.status === 'fulfilled') {
        portfolio = portfolio.value as unknown as Array<Record<string, any>>;
        reply.DATA = portfolio[0] || {};
        reply.MESSAGE = 'Portfolio list fetched successfully';
        reply.STATUS = Status.SUCCESS;
        code = HTTP_STATUS_CODES.OK;
      } else {
        reply.MESSAGE = 'Something went wrong, please try again after sometime';
        reply.STATUS = Status.ERROR;
        code = HTTP_STATUS_CODES.SERVER_ERR;
      }

      await REDIS_CLIENT.setex(cachedPortfolioKey, cachedPortfolioExp, JSON.stringify(portfolio));
    }

    reply.ENTRY_BY = authenticatedUser.phone || request.ip || '0.0.0.0';
    return response.status(code).json(reply);
  }

  @HandleException()
  public static async edit(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;
    const { portfolioId } = request.params;
    let updatedRecord, code: number;

    request.body.updatedAt = new Date();
    [updatedRecord] = await Promise.allSettled([
      Portfolio.findByIdAndUpdate(portfolioId, request.body, modelUpdateObject()),
      Events.create({ eventName: EventNames.PORTFOLIO_EDITED, firedBy: authenticatedUser._id }),
    ]);

    if (updatedRecord.status === 'fulfilled') {
      updatedRecord = updatedRecord.value as Record<string, any>;
      if (updatedRecord) {
        reply.STATUS = Status.SUCCESS;
        reply.MESSAGE = 'Portfolio updated successfully';
        reply.DATA = updatedRecord;
        code = HTTP_STATUS_CODES.UPDATED;
      } else {
        reply.STATUS = Status.NOT_FOUND;
        reply.MESSAGE = 'Resource not found';
        code = HTTP_STATUS_CODES.NOT_FOUND;
      }
    } else {
      reply.MESSAGE = 'Something went wrong, please try again after sometime.';
      reply.STATUS = Status.ERROR;
      code = HTTP_STATUS_CODES.SERVER_ERR;
    }

    reply.ENTRY_BY = authenticatedUser?.phone || request.ip || '0.0.0.0';
    return response.status(code).json(reply);
  }
}

export default PortfolioController;

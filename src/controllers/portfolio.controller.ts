import { Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import Portfolio from '../models/portfolio.model';
import { CustomReq } from '../interfaces';
import { ModelNames } from '../constant';
import { Convert } from '../helpers/convertibles.helper';

class PortfolioController {
  @HandleException()
  public static async create(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;

    request.body.portfolio_user = authenticatedUser._id;
    const portfolio = await Portfolio.create(request.body);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Portfolio created successfully';
    reply.DATA = portfolio;
    reply.ENTRY_BY = authenticatedUser.phone;

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async list(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;

    const portfolios = await Portfolio.aggregate([
      {
        $lookup: {
          from: ModelNames.USERS,
          let: { portfolioUser: '$portfolio_user' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$portfolioUser'],
                },
              },
            },
            {
              $project: {
                password: 0,
                _id: 0,
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: 'portfolio_user',
        },
      },
      {
        $unwind: {
          path: '$portfolio_user',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Portfolio list fetched successfully';
    reply.DATA = portfolios;
    reply.ENTRY_BY = authenticatedUser.phone;

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async get(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { portfolio_user } = request.params;
    const { authenticatedUser } = request;

    const portfolios = await Portfolio.aggregate([
      {
        $match: {
          portfolio_user: Convert.toObjectId(portfolio_user),
        },
      },
      {
        $lookup: {
          from: ModelNames.USERS,
          let: { portfolioUser: '$portfolio_user' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$portfolioUser'],
                },
              },
            },
            {
              $project: {
                password: 0,
                _id: 0,
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: 'portfolio_user',
        },
      },
      {
        $unwind: {
          path: '$portfolio_user',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Portfolio list fetched successfully';
    reply.DATA = portfolios[0] || {};
    reply.ENTRY_BY = authenticatedUser.phone;

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async edit(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const { authenticatedUser } = request;
    const { portfolioId } = request.params;

    request.body.updatedAt = new Date();
    const updatedRecord = await Portfolio.findByIdAndUpdate(portfolioId, request.body, {
      new: true,
      runValidators: true,
    });

    if (updatedRecord) {
      reply.STATUS = Status.SUCCESS;
      reply.MESSAGE = 'Portfolio updated successfully';
      reply.DATA = updatedRecord;
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.UPDATED).json(reply);
    } else {
      (reply.STATUS = Status.NOT_FOUND), (reply.MESSAGE = 'Resource not found');
      reply.ENTRY_BY = authenticatedUser.phone;

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }
  }
}

export default PortfolioController;

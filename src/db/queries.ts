import { PipelineStage } from 'mongoose';
import { EventNames, ModelNames } from '../constant';

class Queries {
  static listPortfolio(): Array<PipelineStage> {
    return [
      {
        $lookup: {
          from: ModelNames.USERS,
          localField: 'portfolio_user',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                password: 0,
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
    ];
  }

  static getDailyWebsiteViews(currentDate: Date): Array<PipelineStage> {
    const todayDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
    const nextDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${
      currentDate.getDate() + 1
    }`;

    return [
      {
        $match: {
          eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED,
          createdAt: {
            $lte: new Date(nextDate),
            $gte: new Date(todayDate),
          },
        },
      },
      {
        $group: {
          _id: '$firedBy',
          events: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          view_count: { $sum: '$count' },
        },
      },
      { $project: { _id: 0 } },
    ];
  }

  static getMonthlyWebsiteViews(currentDate: Date): Array<PipelineStage> {
    const todayDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;

    const previousDate = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

    return [
      {
        $match: {
          eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED,
          createdAt: {
            $lte: new Date(todayDate),
            $gte: new Date(previousDate),
          },
        },
      },
      {
        $group: {
          _id: '$firedBy',
          events: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          count: { $size: '$events' },
        },
      },
      {
        $group: {
          _id: null,
          view_count: { $sum: '$count' },
        },
      },
      { $project: { _id: 0 } },
    ];
  }

  static getTotalViews(): Array<PipelineStage> {
    return [
      {
        $match: {
          eventName: EventNames.PORTFOLIO_WEBSITE_VIEWED,
        },
      },
      {
        $group: {
          _id: '$firedBy',
          events: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          count: { $size: '$events' },
        },
      },
      {
        $group: {
          _id: null,
          view_count: { $sum: '$count' },
        },
      },
      { $project: { _id: 0 } },
    ];
  }

  static checkExistingContact(email: string): Array<PipelineStage> {
    const currentMillis = Date.now();
    const yesterdayMillis = currentMillis - 24 * 60 * 60 * 1000;

    return [
      {
        $match: {
          email,
          $and: [
            {
              createdAt: {
                $gte: new Date(yesterdayMillis),
              },
            },
            {
              createdAt: {
                $lte: new Date(currentMillis),
              },
            },
          ],
        },
      },
    ];
  }
}

export default Queries;

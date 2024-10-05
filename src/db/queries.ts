import { PipelineStage } from 'mongoose';
import { ModelNames } from '../constant';

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
    ];
  }
}

export default Queries;

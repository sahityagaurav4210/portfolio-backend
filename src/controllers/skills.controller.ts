import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { init } from '@config/logs.config';
import { HandleException } from '@decorators/exception.decorator';
import { performParallelTask } from '@helpers/index';
import { CustomReq } from '@interfaces/index';
import { Events } from '@models/events.model';
import Skill from '@models/skills.model';
import { Response } from 'express';
import { EventNames, RedisConstants } from '../constant';
import connectRedis from '@config/redis.config';

class SkillController {
  @HandleException()
  public static async create(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone } = authenticatedUser || {};
    const identity = phone || ip || '0.0.0.0';
    const REDIS_CLIENT = connectRedis();
    const url = request.file ? `/assets/${request.file.filename}` : undefined;

    const payload = { ...body, user: _id, url };
    const notificationPayload = {
      content: {
        username: authenticatedUser.name,
        skillName: body.name,
        link: 'mailto:works.sahitya@gmail.com',
        email: authenticatedUser.email,
        subject: `A new skill has been added in your portfolio by ${authenticatedUser.name} at ${new Date().toLocaleString()}.`,
        skillExperience: body.experience + ' months',
        timestamp: new Date().toLocaleString(),
      },
      timestamp: new Date(),
    };

    await performParallelTask([
      Skill.create(payload),
      Events.create({ eventName: EventNames.SKILL_CREATED, firedBy: identity }),
      REDIS_CLIENT.publish(
        RedisConstants.SKILL_ADDITION_CHANNEL_NAME,
        JSON.stringify(notificationPayload)
      ),
    ]);

    const message = `A new skill was added by user having identity no ${identity}.`;
    logger.info({ message });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Skill added successfully';
    reply.ENTRY_BY = identity;

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async list(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip } = request || {};
    const { phone } = authenticatedUser || {};
    const identity = phone || ip || '0.0.0.0';

    const [skills] = await performParallelTask([
      Skill.find(
        { user: authenticatedUser._id, isActive: true },
        { updatedAt: 0, __v: 0, user: 0, createdAt: 0 },
        { lean: true, sort: { createdAt: -1 } }
      ),
      Events.create({ eventName: EventNames.SKILL_LIST_FETCHED_ADMIN, firedBy: identity }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Skill added successfully';
    reply.ENTRY_BY = identity;
    reply.DATA = skills;
    const message = `Skill list was fetched by the user having identity no ${identity}.`;

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async update(request: CustomReq, response: Response) {
    const reply = new ApiResponse();
    const logger = init();
    const REDIS_CLIENT = connectRedis();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone } = authenticatedUser || {};
    const { skillId } = request.params || {};
    const identity = phone || ip || '0.0.0.0';
    const url = request.file ? `/assets/${request.file.filename}` : undefined;

    const payload = { ...body, user: _id, url };
    const oldSkillRecord = await Skill.findById(skillId);

    if (!oldSkillRecord) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE =
        "Sorry, we couldn't find the skill record you are trying to update. It might have been removed.";
      reply.ENTRY_BY = identity;

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    const notificationPayload = {
      content: {
        username: authenticatedUser.name,
        link: 'mailto:works.sahitya@gmail.com',
        email: authenticatedUser.email,
        subject: `A skill has been updated in your portfolio by ${authenticatedUser.name} at ${new Date().toLocaleString()}.`,
        skill: {
          skillName: oldSkillRecord.name,
          skillExperience: oldSkillRecord.experience + ' months',
          skillDesc: oldSkillRecord.description,
          newSkillName: body.name,
          newSkillExperience: body.experience + ' months',
          newSkillDesc: body.description,
        },
        timestamp: new Date().toLocaleString(),
      },
      timestamp: new Date(),
    };

    await performParallelTask([
      Skill.updateOne({ _id: skillId }, { $set: { ...payload, updatedAt: new Date() } }),
      Events.create({ eventName: EventNames.SKILL_UPDATED, firedBy: identity }),
      REDIS_CLIENT.publish(
        RedisConstants.SKILL_UPDATE_CHANNEL_NAME,
        JSON.stringify(notificationPayload)
      ),
    ]);

    const message = `A new skill was updated by user having identity no ${identity}.`;
    logger.info({ message });

    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async delete(request: CustomReq, response: Response) {
    const logger = init();
    const { authenticatedUser, ip } = request || {};
    const { phone } = authenticatedUser || {};
    const { skillId } = request.params || {};
    const identity = phone || ip || '0.0.0.0';

    await performParallelTask([
      Skill.updateOne({ _id: skillId }, { $set: { isActive: false, updatedAt: new Date() } }),
      Events.create({ eventName: EventNames.SKILL_DELETED_ADMIN, firedBy: identity }),
    ]);

    const message = `A new skill was deleted by user having identity no ${identity}.`;

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async clientSkillList(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip } = request || {};
    const { userId } = authenticatedUser || {};
    const identity = userId || ip || '0.0.0.0';

    const [skills] = await performParallelTask([
      Skill.find(
        { user: userId, isActive: true },
        { updatedAt: 0, __v: 0, user: 0, createdAt: 0 },
        { lean: true, sort: { createdAt: -1 } }
      ),
      Events.create({ eventName: EventNames.SKILL_LIST_FETCHED, firedBy: identity }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Skills fetched successfully';
    reply.ENTRY_BY = identity;
    reply.DATA = skills;
    const message = `Skill list was fetched by the client having identity no ${identity}.`;

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default SkillController;

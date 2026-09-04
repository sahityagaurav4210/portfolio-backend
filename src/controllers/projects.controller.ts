import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { init } from '@config/logs.config';
import connectRedis from '@config/redis.config';
import { EventNames, RedisConstants } from '../constant';
import { HandleException } from '@decorators/exception.decorator';
import { performParallelTask } from '@helpers/index';
import { CustomReq } from '@interfaces/index';
import { Events } from '@models/events.model';
import Project from '@models/projects.model';
import { Response } from 'express';

class ProjectsController {
  @HandleException()
  public static async create(request: CustomReq, response: Response): Promise<Response> {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone, name: userName, email: userEmail } = authenticatedUser || {};
    const identity = phone || ip || '0.0.0.0';
    const REDIS_CLIENT = connectRedis();
    const cardImage = request.file ? `/assets/${request.file.filename}` : null;

    const payload = { ...body, user: _id, ...(cardImage ? { cardImage } : {}) };
    const notificationPayload = {
      content: {
        username: userName,
        projectName: body.name,
        projectType: body.type,
        email: userEmail,
        subject: `A new project "${body.name}" has been added by ${userName} at ${new Date().toLocaleString()}.`,
        timestamp: new Date().toLocaleString(),
      },
      timestamp: new Date(),
    };

    const [newProject] = await performParallelTask([
      Project.create(payload),
      Events.create({ eventName: EventNames.PROJECT_CREATED, firedBy: identity }),
      REDIS_CLIENT.publish(
        RedisConstants.PROJECT_ADDITION_CHANNEL_NAME,
        JSON.stringify(notificationPayload)
      ),
    ]);

    const message = `A new project was added by user having identity ${identity}.`;
    logger.info({ message });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Project added successfully';
    reply.ENTRY_BY = identity;
    reply.DATA = newProject;

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async list(request: CustomReq, response: Response): Promise<Response> {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip, query } = request || {};
    const { _id, phone } = authenticatedUser || {};
    const identity = phone || ip || '0.0.0.0';
    const { type } = query || {};

    const filter: Record<string, any> = { user: _id, isActive: true };
    if (type) {
      filter.type = type;
    }

    const [projects] = await performParallelTask([
      Project.find(
        filter,
        { updatedAt: 0, __v: 0, user: 0 },
        { lean: true, sort: { priority: -1, createdAt: -1 } }
      ),
      Events.create({ eventName: EventNames.PROJECT_LIST_FETCHED_ADMIN, firedBy: identity }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Projects fetched successfully';
    reply.ENTRY_BY = identity;
    reply.DATA = projects;

    const message = `Project list was fetched by user having identity ${identity}.`;
    logger.info({ message });

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async update(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const logger = init();
    const REDIS_CLIENT = connectRedis();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone, name: userName, email: userEmail } = authenticatedUser || {};
    const { projectId } = request.params || {};
    const identity = phone || ip || '0.0.0.0';
    const cardImage = request.file ? `/assets/${request.file.filename}` : body.cardImage;

    const payload = { ...body, user: _id, ...(cardImage ? { cardImage } : {}) };
    const oldProjectRecord = await Project.findOne({ _id: projectId, user: _id });

    if (!oldProjectRecord) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE =
        "Sorry, we couldn't find the project record you are trying to update. It might have been removed.";
      reply.ENTRY_BY = identity;

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    const notificationPayload = {
      content: {
        username: userName,
        email: userEmail,
        subject: `Project "${oldProjectRecord.name}" has been updated by ${userName} at ${new Date().toLocaleString()}.`,
        project: {
          previousName: oldProjectRecord.name,
          newName: body.name || oldProjectRecord.name,
        },
        timestamp: new Date().toLocaleString(),
      },
      timestamp: new Date(),
    };

    await performParallelTask([
      Project.updateOne({ _id: projectId }, { $set: { ...payload, updatedAt: new Date() } }),
      Events.create({ eventName: EventNames.PROJECT_UPDATED, firedBy: identity }),
      REDIS_CLIENT.publish(
        RedisConstants.PROJECT_UPDATE_CHANNEL_NAME,
        JSON.stringify(notificationPayload)
      ),
    ]);

    const message = `A project was updated by user having identity ${identity}.`;
    logger.info({ message });

    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async delete(request: CustomReq, response: Response): Promise<Response> {
    const logger = init();
    const { authenticatedUser, ip } = request || {};
    const { phone } = authenticatedUser || {};
    const { projectId } = request.params || {};
    const identity = phone || ip || '0.0.0.0';

    await performParallelTask([
      Project.updateOne({ _id: projectId }, { $set: { isActive: false, updatedAt: new Date() } }),
      Events.create({ eventName: EventNames.PROJECT_DELETED_ADMIN, firedBy: identity }),
    ]);

    const message = `A project was deleted by user having identity ${identity}.`;
    logger.info({ message });

    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async clientProjectList(request: CustomReq, response: Response): Promise<Response> {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip, query } = request || {};
    const { userId } = authenticatedUser || {};
    const identity = userId || ip || '0.0.0.0';
    const { type } = query || {};

    const filter: Record<string, any> = { user: userId, isActive: true, disabled: { $ne: true } };
    if (type) {
      filter.type = type;
    }

    const [projects] = await performParallelTask([
      Project.find(
        filter,
        { updatedAt: 0, __v: 0, user: 0, createdAt: 0, isActive: 0 },
        { lean: true, sort: { priority: -1, createdAt: -1 } }
      ),
      Events.create({ eventName: EventNames.PROJECT_LIST_FETCHED, firedBy: identity }),
    ]);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Projects fetched successfully';
    reply.ENTRY_BY = identity;
    reply.DATA = projects;

    const message = `Project list was fetched by client having identity ${identity}.`;
    logger.info({ message });

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default ProjectsController;

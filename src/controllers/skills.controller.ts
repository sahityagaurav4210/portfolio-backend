import { ApiResponse, HTTP_STATUS_CODES, Status } from "@api/index";
import { init } from "@config/logs.config";
import { HandleException } from "@decorators/exception.decorator";
import { CustomReq } from "@interfaces/index";
import Skill from "@models/skills.model";
import { Response } from "express";

class SkillController {
  @HandleException()
  public static async create(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone } = authenticatedUser || {};
    const identity = phone || ip || "0.0.0.0";

    const payload = { ...body, user: _id };
    await Skill.create(payload);

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Skill added successfully";
    reply.ENTRY_BY = identity;
    const message = `A new skill was added by user having identity no ${identity}.`

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async list(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip } = request || {};
    const { phone } = authenticatedUser || {};
    const identity = phone || ip || "0.0.0.0";

    const skills = await Skill.find({ user: authenticatedUser._id }, { updatedAt: 0, __v: 0, user: 0, createdAt: 0 }, { lean: true, sort: { createdAt: -1 } });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Skill added successfully";
    reply.ENTRY_BY = identity;
    reply.DATA = skills;
    const message = `Skill list was fetched by the user having identity no ${identity}.`

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async update(request: CustomReq, response: Response) {
    const logger = init();
    const { authenticatedUser, ip, body } = request || {};
    const { _id, phone } = authenticatedUser || {};
    const { skillId } = request.params || {};
    const identity = phone || ip || "0.0.0.0";

    const payload = { ...body, user: _id };
    await Skill.updateOne({ _id: skillId }, { $set: { ...payload, updatedAt: new Date() } });

    const message = `A new skill was updated by user having identity no ${identity}.`

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.NO_CONTENT).json();
  }

  @HandleException()
  public static async clientList(request: CustomReq, response: Response) {
    const logger = init();
    const reply = new ApiResponse();
    const { authenticatedUser, ip } = request || {};
    const { userId } = authenticatedUser || {};
    const identity = userId || ip || "0.0.0.0";

    const skills = await Skill.find({ user: userId }, { updatedAt: 0, __v: 0, user: 0, createdAt: 0 }, { lean: true, sort: { createdAt: -1 } });

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = "Skills fetched successfully";
    reply.ENTRY_BY = identity;
    reply.DATA = skills;
    const message = `Skill list was fetched by the client having identity no ${identity}.`

    logger.info({ message });
    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default SkillController;
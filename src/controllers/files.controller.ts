import * as path from 'node:path';
import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { parseQsAsBoolean } from '../helpers';
import Files from '@helpers/files.helpers';
import { getObjectAsBlob } from '@helpers/aws.helpers';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';

import { Files as FileModel } from '@models/files.model';
import { CustomReq } from '@interfaces/index';
import { User } from '@models/users.model';
import { EventNames, FileTypes } from '../constant';
import { init } from '@config/logs.config';
import { Events } from '@models/events.model';

class FilesController {
  @HandleException()
  public static async downloadCV(request: Request, response: Response) {
    const reply = new ApiResponse();
    const token = request.query.token;
    const record = await FileModel.findOne({ token, file_type: 'cv', is_active: true });

    if (!record) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'Invalid user id';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }
    let blob: Buffer;

    const fetchReply = await fetch(record.url);
    blob = Buffer.from(await fetchReply.arrayBuffer());

    return response
      .writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'application/pdf' })
      .end(blob);
  }

  @HandleException()
  public static async saveCV(request: CustomReq, response: Response) {
    const reply = new ApiResponse();
    const userId = request.authenticatedUser._id;
    const { url } = request.body;

    const user = await User.findById(userId);

    if (!user) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'Invalid user';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }
    if (!user?.tokens?.length) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'No tokens found';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }

    const list = await FileModel.find({ userId, file_type: 'cv' });

    if (list.length) {
      list[list.length - 1].is_active = false;
      await list[list.length - 1].save();
    }

    const record = await FileModel.create({
      url,
      userId,
      file_type: 'CV',
      token: user.tokens[user.tokens?.length - 1],
      is_active: true,
    });

    if (!record) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'CV saved successfully';
    reply.ENTRY_BY = request.ip || '0.0.0.0';
    reply.DATA = record;

    return response.status(HTTP_STATUS_CODES.CREATED).json(reply);
  }

  @HandleException()
  public static async downloadPhoto(request: Request, response: Response) {
    const reply = new ApiResponse();
    const photoUrl = process.env.PHOTO_URL || '';
    const photoPath = path.resolve(__dirname, '../', 'uploads/Photo.jpg');
    let blob: Buffer;

    if (Files.exists(photoPath))
      blob = await Files.readFile(photoPath).catch(_ => Buffer.from(JSON.stringify({})));
    else {
      blob = await getObjectAsBlob(photoUrl);
      await Files.createFile(photoPath, blob).catch(_ => Buffer.from(JSON.stringify({})));
    }

    if (blob.length === 2) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }

    return response.writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'image/jpeg' }).end(blob);
  }

  @HandleException()
  public static async downloadCVAdmin(request: Request, response: Response) {
    const reply = new ApiResponse();
    const userId = request.query.userId;
    const record = await FileModel.findOne({ userId, file_type: 'cv', is_active: true });

    if (!record) {
      reply.STATUS = Status.NOT_FOUND;
      reply.MESSAGE = 'Invalid user id';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.NOT_FOUND).json(reply);
    }
    let blob: Buffer;

    const fetchReply = await fetch(record.url);
    blob = Buffer.from(await fetchReply.arrayBuffer());

    return response
      .writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'application/pdf' })
      .end(blob);
  }

  @HandleException()
  public static async downloadResume(request: Request, response: Response) {
    const reply = new ApiResponse();
    const website = request.body.website;
    const logger = init();

    const record = await FileModel.findOne({
      websites: { $in: [website] },
      file_type: FileTypes.RESUME,
      is_active: true,
    });

    if (!record) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Invalid details';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    let blob: Buffer;

    const resumePath = path.resolve(__dirname, '../', `.${record.url}`);

    if (Files.exists(resumePath))
      blob = await Files.readFile(resumePath).catch(_ => Buffer.from(JSON.stringify({})));
    else blob = Buffer.from(JSON.stringify({}));

    if (blob.length === 2) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.UNAVAILABLE).json(reply);
    }

    logger.info({ message: `Resume downloaded for ${website} by ${request.ip || '0.0.0.0'}` });
    await Events.create({
      eventName: EventNames.PORTFOLIO_WEBSITE_RESUME_DOWNLOADED,
      firedBy: request.ip || '0.0.0.0',
    });

    return response
      .writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'application/pdf' })
      .end(blob);
  }

  @HandleException()
  public static async getCVList(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const userId = request.authenticatedUser._id;
    const type = parseQsAsBoolean(request.query.type as string);

    let match: Record<string, boolean> = {};

    if (type) match = { is_active: true };
    else match = { is_active: false };

    const record = await FileModel.find(
      { userId, file_type: 'cv', ...match },
      { url: 1, is_active: 1, file_type: 1 },
      { lean: true }
    );

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'CV list fetched successfully';
    reply.ENTRY_BY = request.ip || '0.0.0.0';
    reply.DATA = record;

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  @HandleException()
  public static async getAllCVList(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const userId = request.authenticatedUser._id;

    const record = await FileModel.find(
      { userId, file_type: 'cv' },
      { url: 1, is_active: 1, file_type: 1 },
      { lean: true }
    );

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'CV list fetched successfully';
    reply.ENTRY_BY = request.ip || '0.0.0.0';
    reply.DATA = record;

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }

  /**
   *
   * @param request An authenticated request
   * @param response A express response object
   * @returns A express response object
   * @description
   * - Uploads the user uploaded file to disk and updates the necessary records in the db for that authenticated   user.
   * @access private
   */
  @HandleException()
  public static async saveUserResume(request: CustomReq, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const uploadedResume = request.file;
    const websites = request.body.websites.split(',');
    const authUserId = request.authenticatedUser._id;

    if (!uploadedResume) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Please upload a resume';
      reply.ENTRY_BY = authUserId.phone || request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const uri = `/assets/${uploadedResume.filename}`;
    await FileModel.findOneAndUpdate(
      { $and: [{ userId: authUserId, file_type: FileTypes.RESUME }] },
      {
        $set: { url: uri, updatedAt: new Date(), websites, is_active: true },
        $setOnInsert: { createdAt: new Date() },
      },
      { runValidators: true, new: true, upsert: true }
    );

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Api operation was successful';
    reply.DATA = { message: 'Resumed saved successfully' };
    reply.ENTRY_BY = authUserId.phone || request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.UPDATED).json(reply);
  }

  /**
   *
   * @param request A express request
   * @param response A express response object
   * @returns A express response object
   * @description
   * - Retrieves the basic resume information based on the website fully qualified domain name address
   * @access public
   */
  @HandleException()
  public static async getResumeInfo(request: Request, response: Response): Promise<Response> {
    const reply = new ApiResponse();
    const website = request.body.website;

    if (!website) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = 'Api operation was un-successful';
      reply.DATA = { message: 'Please provide complete and valid details' };
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
    }

    const resumeInfo = await FileModel.findOne({ websites: { $in: website } }).lean();

    reply.STATUS = Status.SUCCESS;
    reply.MESSAGE = 'Api operation was successful';
    reply.DATA = { message: 'Resumed info fetched successfully', uri: resumeInfo?.url };
    reply.ENTRY_BY = request.ip || '0.0.0.0';

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default FilesController;

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
    if (!user?.tokens || !user.tokens.length) {
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
}

export default FilesController;

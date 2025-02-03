import * as path from 'path';
import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { Files } from '../helpers';
import { getObjectAsBlob } from '@helpers/aws.helpers';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';

class FilesController {
  @HandleException()
  public static async downloadCV(request: Request, response: Response) {
    const reply = new ApiResponse();
    const cv_url = process.env.CV_URL || '';
    let blob: Buffer;
    const cvFilePath = path.resolve(__dirname, '../', 'uploads/CV.pdf');

    if (Files.exists(cvFilePath))
      blob = await Files.readFile(cvFilePath).catch(_ => Buffer.from(JSON.stringify({})));
    else {
      blob = await getObjectAsBlob(cv_url);
      await Files.createFile(cvFilePath, blob).catch(_ => Buffer.from(JSON.stringify({})));
    }

    if (blob.length === 2) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }
    return response
      .writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'application/pdf' })
      .end(blob);
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
}

export default FilesController;

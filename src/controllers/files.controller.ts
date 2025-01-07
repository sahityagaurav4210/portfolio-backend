import * as path from 'path';
import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { Files, getCVBlob } from '../helpers';
import { getObjectAsBlob } from '@helpers/aws.helpers';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';

class FilesController {
  @HandleException()
  public static async downloadCV(request: Request, response: Response) {
    const reply = new ApiResponse();
    const cv_url = process.env.CV_URL || '';
    const blob = await getObjectAsBlob(cv_url);

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
    const photoUrl = 'WEB_PHOTO.png';
    const blob = await getObjectAsBlob(photoUrl);

    if (blob.length === 2) {
      reply.STATUS = Status.ERROR;
      reply.MESSAGE = 'Something went wrong, please try again after sometime';
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
    }

    return response.writeHead(HTTP_STATUS_CODES.OK, { 'content-type': 'image/png' }).end(blob);
  }
}

export default FilesController;

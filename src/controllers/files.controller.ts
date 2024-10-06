import * as path from 'path';
import { Request, Response } from 'express';
import { HandleException } from '../decorators/exception.decorator';
import { Files, getCVBlob } from '../helpers';

class FilesController {
  @HandleException()
  public static async downloadCV(request: Request, response: Response): Promise<void> {
    const cvurl = process.env.CV_URL || '';
    const cvBlob = await getCVBlob(cvurl);
    const cvPath = path.resolve(__dirname, '../../', 'uploads/Gaurav_Node_Backend_2YOE_CV.pdf');
    await Files.delete(cvPath);

    await Files.createFile(cvPath, cvBlob);
    response.download(cvPath);
  }

  @HandleException()
  public static async downloadPhoto(request: Request, response: Response): Promise<void> {
    const photoUrl = process.env.PHOTO_URL || '';
    const cvBlob = await getCVBlob(photoUrl);
    const photoPath = path.resolve(
      __dirname,
      '../../',
      'uploads/Gaurav_Node_Backend_2YOE_Photo.jpg'
    );
    await Files.delete(photoPath);

    await Files.createFile(photoPath, cvBlob);
    response.download(photoPath);
  }
}

export default FilesController;

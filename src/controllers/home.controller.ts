import { Request, Response } from 'express';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';

class HomeController {
  public static ping(request: Request, response: Response): Response {
    const reply = new ApiResponse(
      Status.SUCCESS,
      'Pong',
      { version: 'v1' },
      request.ip || 'localhost'
    );

    return response.status(HTTP_STATUS_CODES.OK).json(reply);
  }
}

export default HomeController;

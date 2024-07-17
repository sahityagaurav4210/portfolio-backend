import { Request, Response } from 'express';

class HomeController {
  public static ping(request: Request, response: Response): Response {
    return response.status(200).json({
      messsage: 'Pong',
    });
  }
}

export default HomeController;

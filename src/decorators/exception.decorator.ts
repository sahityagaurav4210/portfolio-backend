import { TokenExpiredError } from 'jsonwebtoken';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';
import { init } from '../config/logs.config';

const logger = init();
export function HandleException() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const response = args.find(
        arg =>
          typeof arg === 'object' &&
          typeof arg.status === 'function' &&
          typeof arg.json === 'function' &&
          typeof arg.send === 'function'
      );
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        console.log("message",error?.message||"An error occurred");
        const reply = new ApiResponse(Status.EXCEPTION, 'Something went wrong');
        logger.error({
          message: error?.message || 'An error occurred in handle exception decorator',
        });

        if (error instanceof TokenExpiredError) {
          reply.STATUS = Status.FORBIDDEN;
          reply.MESSAGE = 'Token expired';

          return response.status(HTTP_STATUS_CODES.FORBIDDEN).json(reply);
        }
        return response.status(HTTP_STATUS_CODES.SERVER_ERR).json(reply);
      }
    };

    return descriptor;
  };
}

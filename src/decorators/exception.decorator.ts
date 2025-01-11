import { TokenExpiredError } from 'jsonwebtoken';
import { ApiResponse, HTTP_STATUS_CODES, Status } from '../api';

export function HandleException() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    const { logger } = globalThis as Record<string, any>;

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
        const reply = new ApiResponse(Status.EXCEPTION, error.message || 'An error occurred');

        logger.error({ message: error.message || "An error occurred in handle exception decorator" })
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

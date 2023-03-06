import { ArgumentsHost, Catch, HttpException, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from 'winston';
import { LOGGER } from '../../logger/factories/logger.factory';
import { AppInternalServerErrorException } from '../exceptions/app-internal-server-error.exception';
import { AxiosError } from 'axios';

/**
 * This filter is used to catch all exceptions that are not handled by the other attached filters. Handles exception in
 * the same manner as the core NestJS base exception filter, but also logs any uncaught exceptions to Sentry. Any
 * exception that is not HttpException is treated as uncaught exception, (this is based on the standard NestJS error
 * handling flow, where all exceptions thrown by the application that are not HttpExceptions are treated as Server
 * Errors 500).
 */
@Catch()
export class AppExceptionsFilter extends BaseExceptionFilter {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    super.catch(this.exceptionToHttp(exception), host);
  }

  exceptionToHttp(err: any): HttpException {
    let finalError = err;
    if (err instanceof AxiosError) {
      if (err.cause) {
        this.logger.warn('Axios error cause', {
          type: 'AXIOS_ERROR_CAUSE',
          err: err.cause,
        });
      }
      const httpError = err?.response?.data;
      finalError = httpError?.statusCode
        ? new HttpException(httpError, httpError.statusCode)
        : new AppInternalServerErrorException();
    }
    if (finalError instanceof HttpException) {
      if (finalError.getStatus() >= 500) {
        this.logger.error('Server error occurred', {
          err: finalError,
          type: 'SERVER_ERROR',
        });
      }
      return finalError;
    }
    this.logger.error('Unknown exception occurred', {
      err: finalError,
      type: 'UNKNOWN_ERROR',
    });
    return new AppInternalServerErrorException();
  }
}

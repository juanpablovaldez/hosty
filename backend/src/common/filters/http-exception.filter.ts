import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    const body =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown>);

    this.logger.warn(
      `[${status}] ${request.method} ${request.url} – ${JSON.stringify(body)}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...body,
    });
  }
}

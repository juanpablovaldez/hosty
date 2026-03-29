import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../../generated/prisma/client';
import type { Response } from 'express';

const KNOWN_ERROR_STATUS: Record<string, HttpStatus> = {
  P2000: HttpStatus.BAD_REQUEST,
  P2002: HttpStatus.CONFLICT,
  P2025: HttpStatus.NOT_FOUND,
};

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  constructor(applicationRef: AbstractHttpAdapter) {
    super(applicationRef);
  }

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const status =
        KNOWN_ERROR_STATUS[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.warn(`Prisma error ${exception.code}: ${exception.message}`);
      res.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: this.resolveMessage(exception.code),
        code: exception.code,
      });
      return;
    }

    this.logger.error(`Prisma validation error: ${exception.message}`);
    res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      message: 'Invalid request data',
    });
  }

  private resolveMessage(code: string): string {
    switch (code) {
      case 'P2002':
        return 'A record with the given data already exists.';
      case 'P2025':
        return 'Record not found.';
      default:
        return 'Database request error.';
    }
  }
}

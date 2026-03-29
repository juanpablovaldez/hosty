import './instrument';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import type { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // ─── Structured logger (replaces default) ────────────────────────────────
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const appConf = configService.get<AppConfig>('app');
  const port = appConf?.port ?? 3000;
  const env = appConf?.env ?? 'development';
  const frontendUrl = appConf?.frontendUrl ?? '';
  const isProd = appConf?.isProd ?? false;

  // ─── CORS ─────────────────────────────────────────
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
      'x-correlation-id',
      'X-Requested-With',
    ],
    exposedHeaders: ['x-correlation-id'],
    credentials: true,
  });

  // ─── Cookie parser ──────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ─── Security headers (helmet) ────────────────────────────────────────────
  app.use(helmet());

  // ─── Global prefix & URI versioning ───────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Global validation pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global exception filters (order: outermost first) ───────────────────
  // PrismaExceptionFilter runs before HttpExceptionFilter (registered last = outermost)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaExceptionFilter(httpAdapter),
    new HttpExceptionFilter(),
  );

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  app.enableShutdownHooks();

  // ─── Swagger (disabled in production) ────────────────────────────────────
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Hosty API')
      .setDescription('Hosty – REST API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Cognito JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`Swagger UI available at http://localhost:${port}/api/docs`);
  }

  await app.listen(port);

  logger.log(
    `Application running in "${env}" mode on port http://localhost:${port}/api`,
  );
}

void bootstrap();

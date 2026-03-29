import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  env: string;
  frontendUrl: string;
  isProd: boolean;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    env: process.env.NODE_ENV ?? 'development',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    isProd: process.env.NODE_ENV === 'production',
  }),
);

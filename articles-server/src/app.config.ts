import { IsEnum, IsNumber } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { createConfigFactoryFromClass } from '@/server-base/config';
import { AppLogLevel, Environment, BaseApiConfig } from '@/server-base/app';

class AppConfig implements BaseApiConfig {
  @IsEnum(AppLogLevel)
  LOG_LEVEL: AppLogLevel = AppLogLevel.VERBOSE;

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.PROD;

  @IsNumber()
  PORT: number = 8083;
}

export default registerAs('app', createConfigFactoryFromClass(AppConfig));

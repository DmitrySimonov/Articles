import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { createConfigFactoryFromClass } from '@/server-base/config';

class ApiConfig {
  @IsString()
  USER_POOL_ID: string;

  @IsString()
  CLIENT_ID: string;
}

export default registerAs('api', createConfigFactoryFromClass(ApiConfig));

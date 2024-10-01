import { registerAs } from '@nestjs/config';
import { createConfigFactoryFromClass } from '@/server-base/config';
import { IsOptional, IsString } from 'class-validator';

class MongoConfig {
  @IsString()
  MONGO_CONNECTION_STRING: string;

  @IsString()
  @IsOptional()
  MONGO_DB_NAME_PREFIX?: string;
}

export default registerAs('mongo', createConfigFactoryFromClass(MongoConfig));

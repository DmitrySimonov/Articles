import { Module } from '@nestjs/common';
import { MongoModule } from '@/server-base/mongo/mongo.module';
import { S3Module } from './s3/s3.module';
import mongoConfig from './mongo.config';

@Module({
  imports: [MongoModule.registerAsyncFromDefaultConfig(mongoConfig), S3Module],
})
export class ProvidersModule {}

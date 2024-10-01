import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { createConfigFactoryFromClass } from '@/server-base/config';

class ArticlesConfig {
  @IsString()
  S3_ARTICLES_BUCKET_NAME: string;
}

export default registerAs('articles-config', createConfigFactoryFromClass(ArticlesConfig));

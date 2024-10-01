import { Module } from '@nestjs/common';
import { ArticlesModule } from '~/core/articles/articles.module';
import { ArticlesApiController } from './articles-api.controller';
import { ArticlesApiService } from './articles-api.service';

@Module({
  controllers: [ArticlesApiController],
  providers: [ArticlesApiService],
  imports: [ArticlesModule],
})
export class ArticlesApiModule {}

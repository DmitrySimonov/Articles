import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import articlesConfig from './articles.config';
import { ArticlesValidationService } from './articles-validation.service';

@Module({
  imports: [ConfigModule.forFeature(articlesConfig)],
  providers: [ArticlesService, ArticlesRepository, ArticlesValidationService],
  exports: [ArticlesService, ArticlesValidationService],
})
export class ArticlesModule {}

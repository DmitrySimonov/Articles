import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Article } from 'shared/api/types/articles';
import { ArticleSchema } from './schema/articles-validation.schema';

@Injectable()
export class ArticlesValidationService {
  public async validateArticle(article: Article) {
    const articleDto = plainToInstance(ArticleSchema, article);

    const errors = await validate(articleDto);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed. Some filed are not filled');
    } else {
      return article;
    }
  }
}

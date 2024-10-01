import { Article } from '@/articles-shared/api';
import { SortOptions } from '@/shared/types/pagination';
import { IsNumber, IsOptional } from 'class-validator';

type SortOptionsArticle = Pick<Article, 'publishedAt' | 'createdAt'>;

export class GetArticlesSortRequest implements SortOptions<SortOptionsArticle> {
  @IsNumber()
  @IsOptional()
  createdAt?: -1 | 1;

  @IsNumber()
  @IsOptional()
  publishedAt?: -1 | 1;
}

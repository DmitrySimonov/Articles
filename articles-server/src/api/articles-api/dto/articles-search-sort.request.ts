import { Article } from '@/articles-shared/api';
import { SortOptions } from '@/shared/types/pagination';
import { IsNumber, IsOptional } from 'class-validator';

type SortOptionsArticle = Pick<Article, 'publishedAt' | 'createdAt'>;

export class ArticleSearchSortRequest implements SortOptions<SortOptionsArticle> {
  @IsNumber()
  @IsOptional()
  publishedAt?: -1 | 1;
}

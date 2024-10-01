import { PaginationOptions } from '@/shared/types/pagination';
import { ArticleStatus } from './articles';

export type GetArticlesOptions = {
  query?: string;
  userId?: string;
  status?: ArticleStatus;
  symbol?: string;
  ric?: string;
} & PaginationOptions;

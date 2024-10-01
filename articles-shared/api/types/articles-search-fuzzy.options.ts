import { PaginationOptions } from '@/shared/types/pagination';

export type ArticleSearchFuzzyOptions = {
  filter: string;
} & PaginationOptions;

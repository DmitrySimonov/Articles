import { WithId } from '@/shared/types/id';
import { Profile } from '@/shared/types/core/profile';
import { Symbols } from '@/shared/types/symbols';

export enum ArticleStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

export enum ArticleMarketDirection {
  NEUTRAL = 'neutral',
  BEARISH = 'bearish',
  BULLISH = 'bullish',
}

export enum FILE_TYPE {
  PDF = 'pdf',
  EDITOR = 'editor',
}

export type File = {
  fileUrl: string;
  fileName: string;
  mimeType: string;
};

export type ArticleUserProfile = Pick<Profile, 'firstName' | 'lastName' | 'pronounce'> & { updatedAt: Date };

export type ArticleSchema = {
  userId: string;
  userProfile: ArticleUserProfile;
  status: ArticleStatus;
  sector: string;
  marketDirection: ArticleMarketDirection;
  file: File;
  price: number;
  symbols: Symbols[];
  updatedAt: Date;
  publishedAt: Date;
  createdAt: Date;
  title: string;
  summary: string;
  type: FILE_TYPE;
};

export type Article = WithId<ArticleSchema>;

export type CreateArticleOptions = Pick<ArticleSchema, 'userProfile'>;

export type CreateDraftArticleOptions = Partial<ArticleSchema>;
export type UpdateArticleOptions = Partial<ArticleSchema>;

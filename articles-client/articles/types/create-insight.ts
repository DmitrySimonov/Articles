import { ArticleMarketDirection } from '@/articles-shared/api';
import { Value } from 'plate-editor/src/types';
import { Symbols } from '@/shared/types/symbols';

export interface ICreateInsightForm {
  marketDirection: ArticleMarketDirection;
  file: File;
  title: string;
  summary: string;
  price: number;
  symbols: Symbols[];
  sector: string;
  editorContent: Value;
}

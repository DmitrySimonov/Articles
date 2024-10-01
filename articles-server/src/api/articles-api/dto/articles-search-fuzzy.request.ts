import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ArticleSearchFuzzyOptions } from 'shared/api/types/articles-search-fuzzy.options';
import { Transform } from 'class-transformer';

export class ArticlesSearchFuzzyRequest implements ArticleSearchFuzzyOptions {
  @ApiProperty({ type: Number, default: 10, required: false, maximum: 100 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  take = 10;

  @IsString()
  @IsOptional()
  next: string | undefined;

  @IsString()
  filter: string;
}

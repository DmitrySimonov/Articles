import { ApiProperty } from '@nestjs/swagger';
import { GetArticlesOptions } from '@/articles-shared/api';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetArticlesRequest implements GetArticlesOptions {
  @ApiProperty({ type: Number, default: 10, required: false, maximum: 100 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  take = 10;

  @IsString()
  @IsOptional()
  next: string | undefined;

  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsString()
  @IsOptional()
  ric?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

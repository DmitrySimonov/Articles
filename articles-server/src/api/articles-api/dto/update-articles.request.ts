import { ApiProperty } from '@nestjs/swagger';
import { Symbols } from '@/shared/types/symbols';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FILE_TYPE_ENUM } from 'shared/api';
import {
  ArticleMarketDirection,
  ArticleStatus,
  ArticleUserProfile,
  File,
  FILE_TYPE,
  UpdateArticleOptions,
} from 'shared/api/types/articles';
import { FileDto } from '~/api/dto/file.dto';
import { SymbolsDto } from '~/api/dto/symbols.dto';
import { UserProfileDto } from '~/api/dto/userProfile.dto';

export class UpdateArticleRequest implements UpdateArticleOptions {
  @ApiProperty()
  @IsOptional()
  @Type(() => UserProfileDto)
  userProfile: ArticleUserProfile;

  @ApiProperty()
  @IsEnum(ArticleStatus)
  @IsOptional()
  status: ArticleStatus;

  @IsString()
  @ApiProperty()
  @IsOptional()
  sector: string;

  @ApiProperty()
  @IsEnum(ArticleMarketDirection)
  @IsOptional()
  marketDirection: ArticleMarketDirection;

  @ApiProperty()
  @Type(() => FileDto)
  @ValidateNested({ each: true })
  @IsOptional()
  file: File;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => SymbolsDto)
  @ValidateNested({ each: true })
  symbols: Symbols[];

  @IsString()
  @ApiProperty()
  @IsOptional()
  summary: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsEnum(FILE_TYPE_ENUM)
  @IsOptional()
  type: FILE_TYPE;
}

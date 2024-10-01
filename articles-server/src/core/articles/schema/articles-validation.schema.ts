import { ApiProperty } from '@nestjs/swagger';
import { MongoId } from '@/server-base/mongo/mongo-id.decorator';
import { ID } from '@/shared/types/id';
import { Symbols } from '@/shared/types/symbols';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Article, ArticleMarketDirection, ArticleStatus, FILE_TYPE, FILE_TYPE_ENUM } from 'shared/api';
import { ArticleUserProfile } from 'shared/api/types/articles';
import { FileDto } from '~/api/dto/file.dto';
import { SymbolsDto } from '~/api/dto/symbols.dto';
import { UserProfileDto } from '~/api/dto/userProfile.dto';

export class ArticleSchema implements Article {
  @MongoId()
  _id: ID;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @Type(() => FileDto)
  @Expose()
  @ValidateNested()
  file: FileDto;

  @ApiProperty()
  @Type(() => UserProfileDto)
  @Expose()
  @ValidateNested()
  userProfile: ArticleUserProfile;

  @ApiProperty()
  @Expose()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @ApiProperty()
  @Expose()
  @IsString()
  sector: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @IsNotEmpty()
  @Type(() => SymbolsDto)
  @ValidateNested({ each: true })
  symbols: Symbols[];

  @ApiProperty()
  @Expose()
  @IsEnum(ArticleMarketDirection)
  marketDirection: ArticleMarketDirection;

  @ApiProperty()
  @Expose()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  publishedAt: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsEnum(FILE_TYPE_ENUM)
  @Expose()
  type: FILE_TYPE;
}

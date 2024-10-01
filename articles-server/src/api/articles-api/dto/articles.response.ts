import { ApiProperty } from '@nestjs/swagger';
import { MongoId } from '@/server-base/mongo/mongo-id.decorator';
import { ID } from '@/shared/types/id';
import { Symbols } from '@/shared/types/symbols';
import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Article, ArticleMarketDirection, ArticleStatus, File, FILE_TYPE, FILE_TYPE_ENUM } from 'shared/api';
import { ArticleUserProfile } from 'shared/api/types/articles';
import { FileDto } from '~/api/dto/file.dto';
import { SymbolsDto } from '~/api/dto/symbols.dto';
import { UserProfileDto } from '~/api/dto/userProfile.dto';

export class ArticleResponse implements Partial<Article> {
  @MongoId()
  _id: ID;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  summary: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Type(() => FileDto)
  @Expose()
  file: File;

  @ApiProperty()
  @Type(() => UserProfileDto)
  @Expose()
  userProfile: ArticleUserProfile;

  @ApiProperty()
  @Expose()
  status: ArticleStatus;

  @ApiProperty()
  @Expose()
  sector: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  @Type(() => SymbolsDto)
  symbols: Symbols[];

  @ApiProperty()
  @Expose()
  marketDirection: ArticleMarketDirection;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  publishedAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @IsEnum(FILE_TYPE_ENUM)
  @Expose()
  type: FILE_TYPE;
}

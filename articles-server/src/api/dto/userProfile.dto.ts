import { ApiProperty } from '@nestjs/swagger';
import { ID } from '@/shared/types/id';
import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ArticleUserProfile } from 'shared/api/types/articles';

export class UserProfileDto implements ArticleUserProfile {
  @IsString()
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  lastName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  pronounce: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  updatedAt: Date;
}

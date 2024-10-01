import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ArticleUserProfile, CreateArticleOptions } from 'shared/api/types/articles';
import { UserProfileDto } from '~/api/dto/userProfile.dto';

export class CreateArticleRequest implements CreateArticleOptions {
  @ApiProperty()
  @Type(() => UserProfileDto)
  @ValidateNested({ each: true })
  userProfile: ArticleUserProfile;
}

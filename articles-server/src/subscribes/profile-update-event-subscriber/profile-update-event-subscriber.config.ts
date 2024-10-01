import { IsUrl } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { createConfigFactoryFromClass } from '@/server-base/config';

class UpdateProfileEventPublisherConfig {
  @IsUrl()
  SQS_PROFILE_UPDATE_EVENT: string;
}

export default registerAs(
  'updateProfileEventPublisherConfig',
  createConfigFactoryFromClass(UpdateProfileEventPublisherConfig),
);

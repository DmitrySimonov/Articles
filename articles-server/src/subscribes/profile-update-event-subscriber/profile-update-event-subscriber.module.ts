import { Module } from '@nestjs/common';
import { SqsModule } from '@/server-base/events/sqs/sqs.module';
import { ProfileUpdateEventSubscriberService } from './profile-update-event-subscriber.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import updateProfileEventPublisherConfig from './profile-update-event-subscriber.config';
import { ArticlesModule } from '~/core/articles/articles.module';

@Module({
  imports: [
    SqsModule.registerAsync({
      imports: [ConfigModule.forFeature(updateProfileEventPublisherConfig), ArticlesModule],
      inject: [updateProfileEventPublisherConfig.KEY],
      subscriber: ProfileUpdateEventSubscriberService,
      useFactory: (config: ConfigType<typeof updateProfileEventPublisherConfig>) => {
        return {
          queueUrl: config.SQS_PROFILE_UPDATE_EVENT,
        };
      },
    }),
  ],
})
export class ProfileUpdateEventSubscriberModule {}

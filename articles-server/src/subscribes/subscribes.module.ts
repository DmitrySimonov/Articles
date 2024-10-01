import { Module } from '@nestjs/common';
import { ProfileUpdateEventSubscriberModule } from '~/subscribes/profile-update-event-subscriber/profile-update-event-subscriber.module';

@Module({
  imports: [ProfileUpdateEventSubscriberModule],
})
export class SubscribesModule {}

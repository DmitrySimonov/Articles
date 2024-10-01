import { AbstractSqsSubscriberService } from '@/server-base/events/sqs/abstract-sqs-subscriber.service';
import { Injectable, Logger } from '@nestjs/common';
import { SnsPayload } from '@/server-base/events/sns/sns.type';
import { ArticlesService } from '~/core/articles/articles.service';
import { Profile } from '@/shared/types/core/profile';

@Injectable()
export class ProfileUpdateEventSubscriberService extends AbstractSqsSubscriberService<SnsPayload> {
  constructor(private readonly articleService: ArticlesService) {
    super();
  }
  protected async handleMessage(payload: SnsPayload) {
    const { userId, firstName, lastName, pronounce }: Profile = JSON.parse(payload.Message);
    const updatedAt = new Date(payload.Timestamp);
    Logger.log(`New ProfileUpdateEvent %o`, payload, ProfileUpdateEventSubscriberService.name);

    await this.articleService.updateArticlesUserProfileByUser(userId, {
      userProfile: {
        firstName,
        lastName,
        pronounce,
        updatedAt,
      },
    });
  }

  async onHandlingError(error: Error) {
    Logger.error(error);
  }
}

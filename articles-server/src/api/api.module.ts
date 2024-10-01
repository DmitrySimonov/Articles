import { Module } from '@nestjs/common';
import { HealthApiModule } from '@/server-base/health-api';

import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthModule } from '@/server-base/auth';
import apiConfig from '~/api/api.config';
import { ArticlesApiModule } from './articles-api/articles-api.module';

@Module({
  imports: [
    HealthApiModule,
    AuthModule.registerAsync({
      imports: [ConfigModule.forFeature(apiConfig)],
      inject: [apiConfig.KEY],
      useFactory: (config: ConfigType<typeof apiConfig>) => {
        return {
          userPoolId: config.USER_POOL_ID,
          clientId: config.CLIENT_ID,
        };
      },
    }),
    ArticlesApiModule,
  ],
})
export class ApiModule {}

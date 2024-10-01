import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { ProvidersModule } from './providers/providers.module';
import { SubscribesModule } from '~/subscribes/subscribes.module';
import appConfig from '~/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    ApiModule,
    CoreModule,
    SubscribesModule,
    ProvidersModule,
  ],
})
export class AppModule {}

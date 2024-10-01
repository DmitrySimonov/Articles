import { AppModule } from './app.module';
import { start } from '@/server-base/app';
import appConfig from '~/app.config';

start({
  AppModule,
  config: appConfig,
});
// TODO: test

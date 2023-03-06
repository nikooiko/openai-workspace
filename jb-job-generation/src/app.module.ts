import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from './open-ai/open-ai.module';
import { LOGGER } from './logger/factories/logger.factory';
import { ILogger } from './logger/interfaces/logger.interface';
import { LoggerModule } from './logger/logger.module';
import { ValidationModule } from './validation/validation.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule /* global */,
    ErrorHandlingModule,
    ValidationModule,
    OpenAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(LOGGER) private logger: ILogger) {}

  onApplicationBootstrap(): any {
    this.logger.info('Open AI JB bootstrap success!', {
      type: 'JB_BOOTSTRAP',
    });
  }
}

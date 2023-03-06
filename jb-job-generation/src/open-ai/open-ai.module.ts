import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './services/open-ai.service';
import openAiConfig from './config/open-ai.config';
import { OpenAiController } from './controllers/open-ai.controller';

@Module({
  imports: [ConfigModule.forFeature(openAiConfig)],
  providers: [OpenAiService],
  controllers: [OpenAiController],
})
export class OpenAiModule {}

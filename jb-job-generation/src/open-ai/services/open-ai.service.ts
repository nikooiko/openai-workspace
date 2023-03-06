import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';
import { ProposedJobDto } from '../dto/proposed-job.dto';
import { CreateJobQueryDto } from '../dto/create-job-query.dto';
import openAiConfig from '../config/open-ai.config';
import { CreateCompletionRequest } from 'openai/api';
import { LOGGER } from '../../logger/factories/logger.factory';
import { ILogger } from '../../logger/interfaces/logger.interface';

@Injectable()
export class OpenAiService {
  private readonly openAiConfig: Configuration;
  private readonly openAiApi: OpenAIApi;

  constructor(
    @Inject(openAiConfig.KEY)
    private readonly config: ConfigType<typeof openAiConfig>,
    @Inject(LOGGER) private logger: ILogger,
  ) {
    this.openAiConfig = new Configuration({
      // organization: config.orgID,
      apiKey: config.apiKey,
    });
    this.openAiApi = new OpenAIApi(this.openAiConfig);
  }

  async proposeJob(query: CreateJobQueryDto): Promise<ProposedJobDto> {
    const proposedJob: ProposedJobDto = {
      title: '',
      overview: '',
      requirements: '',
      responsibilities: '',
      short: '',
    };
    this.logger.info('OpenAI job proposal starts', {
      type: 'OPENAI_JOB_PROPOSAL_START',
      input: query.input,
    });
    try {
      const data: CreateCompletionResponse = await this.sendCompletionRequest(`
        Write a job post for: '${query.input}'.
        Should return the response a JSON object with the following format:
        { "title": "string", "overview": "string", "requirements": "string", "responsibilities": "string", "short": "string" }`);
      const structuredData = JSON.parse(data.choices[0]?.text || '{}');
      [
        'title',
        'overview',
        'requirements',
        'responsibilities',
        'short',
      ].forEach(
        (
          key:
            | 'title'
            | 'overview'
            | 'requirements'
            | 'responsibilities'
            | 'short',
        ) => {
          if (structuredData[key]) {
            proposedJob[key] = structuredData[key];
          }
        },
      );
    } catch (err) {
      this.logger.error('Error parsing OpenAI response', {
        type: 'OPENAI_CREATE_JOB_POST_ERROR',
        err,
      });
    }
    this.logger.info('OpenAI job proposal', {
      type: 'OPENAI_JOB_PROPOSAL_FINISH',
      input: query.input,
      data: proposedJob,
    });
    return proposedJob;
  }

  async sendCompletionRequest(
    prompt: string,
    options: Partial<CreateCompletionRequest> = {},
  ): Promise<CreateCompletionResponse> {
    const response = await this.openAiApi.createCompletion({
      model: 'text-davinci-003',
      max_tokens: 3500,
      temperature: 0,
      ...options,
      prompt,
    });
    this.logger.debug('OpenAI completion request finished', {
      type: 'OPENAI_COMPLETION',
      data: response.data,
    });
    return response.data;
  }
}

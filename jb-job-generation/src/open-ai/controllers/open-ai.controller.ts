import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProposedJobDto } from '../dto/proposed-job.dto';
import { ApiAppBadRequestResponse } from '../../error-handling/decorators/api-app-bad-request-response.decorator';
import { CreateJobQueryDto } from '../dto/create-job-query.dto';
import { OpenAiService } from '../services/open-ai.service';

@Controller('open-ai')
export class OpenAiController {
  constructor(private openAiService: OpenAiService) {}

  @Get('job-post')
  @ApiOperation({
    summary: 'Returns an OpenAI generated job post',
  })
  @ApiOkResponse({ type: ProposedJobDto })
  @ApiAppBadRequestResponse()
  proposeJob(@Query() query: CreateJobQueryDto): Promise<ProposedJobDto> {
    return this.openAiService.proposeJob(query);
  }
}

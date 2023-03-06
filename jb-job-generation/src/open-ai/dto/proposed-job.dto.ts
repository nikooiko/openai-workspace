import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProposedJobDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  overview: string;
  @ApiProperty()
  @IsString()
  requirements: string;
  @ApiProperty()
  @IsString()
  responsibilities: string;
  @ApiProperty()
  @IsString()
  short: string;
}

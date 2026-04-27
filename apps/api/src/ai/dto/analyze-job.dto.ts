import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AnalyzeJobDto {
  @ApiProperty({
    example:
      'We are hiring a Full Stack Developer with React, Node.js, PostgreSQL, Docker, and CI/CD experience.',
  })
  @IsString()
  @MinLength(50)
  @MaxLength(10000)
  jobDescription: string;
}
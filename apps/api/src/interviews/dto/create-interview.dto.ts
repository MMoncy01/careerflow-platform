import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum InterviewTypeDto {
  HR = 'HR',
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  MANAGERIAL = 'MANAGERIAL',
  FINAL = 'FINAL',
  OTHER = 'OTHER',
}

export enum InterviewResultDto {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class CreateInterviewDto {
  @ApiPropertyOptional({ example: 'Cognizant Technical Round 1' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ enum: InterviewTypeDto, example: InterviewTypeDto.TECHNICAL })
  @IsOptional()
  @IsEnum(InterviewTypeDto)
  type?: InterviewTypeDto;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  round?: number;

  @ApiProperty({ example: '2026-05-05T14:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ enum: InterviewResultDto, example: InterviewResultDto.SCHEDULED })
  @IsOptional()
  @IsEnum(InterviewResultDto)
  result?: InterviewResultDto;

  @ApiPropertyOptional({ example: 'Prepare JavaScript, React, APIs, and project explanation.' })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  notes?: string;

  @ApiPropertyOptional({ example: '2026-05-10T15:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  nextRoundAt?: string;

  @ApiPropertyOptional({ example: 'cmog9pz810001v6pgbe73ezxi' })
  @IsOptional()
  @IsString()
  applicationId?: string;
}
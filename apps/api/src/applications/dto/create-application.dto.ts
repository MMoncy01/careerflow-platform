import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export enum ApplicationStatusDto {
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export class CreateApplicationDto {
  @ApiProperty({ example: 'Cognizant' })
  @IsString()
  @MaxLength(100)
  company: string;

  @ApiProperty({ example: 'Full Stack Developer' })
  @IsString()
  @MaxLength(100)
  role: string;

  @ApiPropertyOptional({ enum: ApplicationStatusDto })
  @IsOptional()
  @IsEnum(ApplicationStatusDto)
  status?: ApplicationStatusDto;

  @ApiPropertyOptional({ example: 'Toronto, ON' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @ApiPropertyOptional({ example: 'https://company.com/jobs/123' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  jobUrl?: string;

  @ApiPropertyOptional({ example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ example: 'Jane Recruiter' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactName?: string;

  @ApiPropertyOptional({ example: 'jane@company.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;

  @ApiPropertyOptional({ example: 'Software Developer Resume v2' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  resumeVersion?: string;

  @ApiPropertyOptional({ example: 'Job description pasted here...' })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  jobDescription?: string;

  @ApiPropertyOptional({ example: 'Referred by recruiter. Follow up next week.' })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  notes?: string;

  @ApiPropertyOptional({ example: '2026-02-15' })
  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @ApiPropertyOptional({ example: '2026-02-22' })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
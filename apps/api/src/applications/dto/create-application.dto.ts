import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @ApiPropertyOptional({ enum: ApplicationStatusDto, default: ApplicationStatusDto.APPLIED })
  @IsOptional()
  @IsEnum(ApplicationStatusDto)
  status?: ApplicationStatusDto;

  @ApiPropertyOptional({ example: 'Referred by X. Follow up on Monday.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ example: '2026-01-25' })
  @IsOptional()
  @IsDateString()
  appliedAt?: string;
}
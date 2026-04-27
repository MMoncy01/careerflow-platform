import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AnalyzeJobDto } from './dto/analyze-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('ai')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Post('analyze-job')
  @ApiOperation({ summary: 'Analyze a job description using Gemini AI' })
  analyzeJob(@Body() dto: AnalyzeJobDto) {
    return this.service.analyzeJob(dto);
  }
}
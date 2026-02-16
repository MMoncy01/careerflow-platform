import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { userIdFromReq } from '../auth/current-user';

@ApiTags('applications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a job application (owned by the current user)' })
  create(@Req() req: any, @Body() dto: CreateApplicationDto) {
    const userId = userIdFromReq(req);
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user job applications (optional filter by status)' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'APPLIED | INTERVIEW | OFFER | REJECTED | WITHDRAWN',
  })
  findAll(@Req() req: any, @Query('status') status?: string) {
    const userId = userIdFromReq(req);
    return this.service.findAll(userId, status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job application (only if owned by current user)' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    const userId = userIdFromReq(req);
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job application (only if owned by current user)' })
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = userIdFromReq(req);
    return this.service.remove(userId, id);
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a job application' })
  create(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.service.create(userIdFromReq(req), dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user job applications' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(userIdFromReq(req), status, search);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user application analytics' })
  stats(@Req() req: any) {
    return this.service.stats(userIdFromReq(req));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job application' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.service.update(userIdFromReq(req), id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job application' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(userIdFromReq(req), id);
  }
}
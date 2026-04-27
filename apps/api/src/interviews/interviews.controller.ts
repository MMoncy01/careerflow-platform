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
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { userIdFromReq } from '../auth/current-user';
  import { InterviewsService } from './interviews.service';
  import { CreateInterviewDto } from './dto/create-interview.dto';
  import { UpdateInterviewDto } from './dto/update-interview.dto';
  
  @ApiTags('interviews')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Controller('interviews')
  export class InterviewsController {
    constructor(private readonly service: InterviewsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create an interview' })
    create(@Req() req: any, @Body() dto: CreateInterviewDto) {
      return this.service.create(userIdFromReq(req), dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'List current user interviews' })
    @ApiQuery({ name: 'result', required: false })
    findAll(@Req() req: any, @Query('result') result?: string) {
      return this.service.findAll(userIdFromReq(req), result);
    }
  
    @Get('upcoming')
    @ApiOperation({ summary: 'List upcoming scheduled interviews' })
    upcoming(@Req() req: any) {
      return this.service.upcoming(userIdFromReq(req));
    }
  
    @Get('stats')
    @ApiOperation({ summary: 'Get current user interview statistics' })
    stats(@Req() req: any) {
      return this.service.stats(userIdFromReq(req));
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update an interview' })
    update(
      @Req() req: any,
      @Param('id') id: string,
      @Body() dto: UpdateInterviewDto,
    ) {
      return this.service.update(userIdFromReq(req), id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an interview' })
    remove(@Req() req: any, @Param('id') id: string) {
      return this.service.remove(userIdFromReq(req), id);
    }
  }
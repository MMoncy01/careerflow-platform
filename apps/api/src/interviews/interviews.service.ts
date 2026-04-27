import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInterviewDto,
  InterviewResultDto,
  InterviewTypeDto,
} from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureApplicationBelongsToUser(
    userId: string,
    applicationId?: string,
  ) {
    if (!applicationId) return;

    const application = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new NotFoundException('Linked application not found');
    }
  }

  async create(userId: string, dto: CreateInterviewDto) {
    await this.ensureApplicationBelongsToUser(userId, dto.applicationId);

    return this.prisma.interview.create({
      data: {
        userId,
        applicationId: dto.applicationId || null,
        title: dto.title?.trim() || null,
        type: (dto.type ?? InterviewTypeDto.TECHNICAL) as any,
        round: dto.round ?? 1,
        scheduledAt: new Date(dto.scheduledAt),
        result: (dto.result ?? InterviewResultDto.SCHEDULED) as any,
        notes: dto.notes?.trim() || null,
        nextRoundAt: dto.nextRoundAt ? new Date(dto.nextRoundAt) : null,
      },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, result?: string) {
    return this.prisma.interview.findMany({
      where: {
        userId,
        ...(result ? { result: result as any } : {}),
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async upcoming(userId: string) {
    const now = new Date();

    return this.prisma.interview.findMany({
      where: {
        userId,
        result: 'SCHEDULED',
        scheduledAt: {
          gte: now,
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
      include: {
        application: {
          select: {
            id: true,
            company: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async stats(userId: string) {
    const interviews = await this.prisma.interview.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        type: true,
        result: true,
        scheduledAt: true,
        round: true,
        application: {
          select: {
            company: true,
            role: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const now = new Date();

    const result = {
      total: interviews.length,
      scheduled: 0,
      completed: 0,
      passed: 0,
      rejected: 0,
      cancelled: 0,
      upcoming: [] as typeof interviews,
    };

    for (const interview of interviews) {
      if (interview.result === 'SCHEDULED') result.scheduled++;
      if (interview.result === 'COMPLETED') result.completed++;
      if (interview.result === 'PASSED') result.passed++;
      if (interview.result === 'REJECTED') result.rejected++;
      if (interview.result === 'CANCELLED') result.cancelled++;

      if (
        interview.result === 'SCHEDULED' &&
        interview.scheduledAt >= now &&
        result.upcoming.length < 5
      ) {
        result.upcoming.push(interview);
      }
    }

    return result;
  }

  async update(userId: string, id: string, dto: UpdateInterviewDto) {
    const existing = await this.prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Interview not found');
    }

    await this.ensureApplicationBelongsToUser(userId, dto.applicationId);

    return this.prisma.interview.update({
      where: { id },
      data: {
        applicationId:
          dto.applicationId !== undefined ? dto.applicationId || null : undefined,
        title: dto.title !== undefined ? dto.title?.trim() || null : undefined,
        type: dto.type as any,
        round: dto.round,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        result: dto.result as any,
        notes: dto.notes !== undefined ? dto.notes?.trim() || null : undefined,
        nextRoundAt:
          dto.nextRoundAt !== undefined
            ? dto.nextRoundAt
              ? new Date(dto.nextRoundAt)
              : null
            : undefined,
      },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Interview not found');
    }

    await this.prisma.interview.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
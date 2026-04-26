import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApplicationStatusDto,
  CreateApplicationDto,
} from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.jobApplication.create({
      data: {
        userId,
        company: dto.company.trim(),
        role: dto.role.trim(),
        status: (dto.status ?? ApplicationStatusDto.APPLIED) as any,

        location: dto.location?.trim() || null,
        jobUrl: dto.jobUrl?.trim() || null,
        source: dto.source?.trim() || null,
        contactName: dto.contactName?.trim() || null,
        contactEmail: dto.contactEmail?.trim() || null,
        resumeVersion: dto.resumeVersion?.trim() || null,
        jobDescription: dto.jobDescription?.trim() || null,

        notes: dto.notes?.trim() || null,
        appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : null,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
        lastActivityAt: new Date(),
      },
    });
  }

  async findAll(userId: string, status?: string, search?: string) {
    return this.prisma.jobApplication.findMany({
      where: {
        userId,
        ...(status ? { status: status as any } : {}),
        ...(search
          ? {
              OR: [
                { company: { contains: search, mode: 'insensitive' } },
                { role: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async stats(userId: string) {
    const applications = await this.prisma.jobApplication.findMany({
      where: { userId },
      select: {
        id: true,
        company: true,
        role: true,
        status: true,
        followUpDate: true,
        lastActivityAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const result = {
      total: applications.length,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      weeklyApplications: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
      needsFollowUp: [] as typeof applications,
      staleApplications: [] as typeof applications,
      recentApplications: applications.slice(0, 5),
    };

    for (const app of applications) {
      if (app.status === 'APPLIED') result.applied++;
      if (app.status === 'INTERVIEW') result.interview++;
      if (app.status === 'OFFER') result.offer++;
      if (app.status === 'REJECTED') result.rejected++;
      if (app.status === 'WITHDRAWN') result.withdrawn++;

      if (app.createdAt >= sevenDaysAgo) {
        result.weeklyApplications++;
      }

      if (app.followUpDate && app.followUpDate <= now) {
        result.needsFollowUp.push(app);
      }

      if (
        app.status === 'APPLIED' &&
        app.lastActivityAt <= sevenDaysAgo
      ) {
        result.staleApplications.push(app);
      }
    }

    if (result.total > 0) {
      const responses = result.interview + result.offer + result.rejected;
      result.responseRate = Math.round((responses / result.total) * 100);
      result.interviewRate = Math.round((result.interview / result.total) * 100);
      result.offerRate = Math.round((result.offer / result.total) * 100);
    }

    return result;
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    const existing = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        company: dto.company?.trim(),
        role: dto.role?.trim(),
        status: dto.status as any,

        location: dto.location !== undefined ? dto.location?.trim() || null : undefined,
        jobUrl: dto.jobUrl !== undefined ? dto.jobUrl?.trim() || null : undefined,
        source: dto.source !== undefined ? dto.source?.trim() || null : undefined,
        contactName:
          dto.contactName !== undefined ? dto.contactName?.trim() || null : undefined,
        contactEmail:
          dto.contactEmail !== undefined ? dto.contactEmail?.trim() || null : undefined,
        resumeVersion:
          dto.resumeVersion !== undefined ? dto.resumeVersion?.trim() || null : undefined,
        jobDescription:
          dto.jobDescription !== undefined ? dto.jobDescription?.trim() || null : undefined,

        notes: dto.notes !== undefined ? dto.notes?.trim() || null : undefined,
        appliedAt:
          dto.appliedAt !== undefined
            ? dto.appliedAt
              ? new Date(dto.appliedAt)
              : null
            : undefined,
        followUpDate:
          dto.followUpDate !== undefined
            ? dto.followUpDate
              ? new Date(dto.followUpDate)
              : null
            : undefined,
        lastActivityAt: new Date(),
      },
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    await this.prisma.jobApplication.delete({ where: { id } });
    return { deleted: true };
  }
}
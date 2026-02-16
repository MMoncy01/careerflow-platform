import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateApplicationDto,
  ApplicationStatusDto,
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
        notes: dto.notes?.trim() || null,
        appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : null,
      },
    });
  }

  async findAll(userId: string, status?: string) {
    return this.prisma.jobApplication.findMany({
      where: {
        userId,
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    // Ownership check: only update if record belongs to the current user
    const existing = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Application not found');

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        company: dto.company?.trim(),
        role: dto.role?.trim(),
        status: dto.status as any,
        notes:
          dto.notes !== undefined ? dto.notes?.trim() || null : undefined,
        appliedAt:
          dto.appliedAt !== undefined
            ? dto.appliedAt
              ? new Date(dto.appliedAt)
              : null
            : undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    // Ownership check: only delete if record belongs to the current user
    const existing = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Application not found');

    await this.prisma.jobApplication.delete({ where: { id } });
    return { deleted: true };
  }
}
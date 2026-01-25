import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto, ApplicationStatusDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto) {
    return this.prisma.jobApplication.create({
      data: {
        company: dto.company.trim(),
        role: dto.role.trim(),
        status: (dto.status ?? ApplicationStatusDto.APPLIED) as any,
        notes: dto.notes?.trim() || null,
        appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : null,
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.jobApplication.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const existing = await this.prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Application not found');

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        company: dto.company?.trim(),
        role: dto.role?.trim(),
        status: dto.status as any,
        notes: dto.notes !== undefined ? (dto.notes?.trim() || null) : undefined,
        appliedAt: dto.appliedAt !== undefined ? (dto.appliedAt ? new Date(dto.appliedAt) : null) : undefined,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Application not found');

    await this.prisma.jobApplication.delete({ where: { id } });
    return { deleted: true };
  }
}
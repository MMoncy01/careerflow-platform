import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Establish DB connection when Nest starts
    await this.$connect();
  }

  async onModuleDestroy() {
    // Gracefully close DB connection when Nest shuts down
    await this.$disconnect();
  }
}

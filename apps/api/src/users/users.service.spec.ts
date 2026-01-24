import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  it('should be defined', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {}, // minimal stub for this simple test
        },
      ],
    }).compile();

    const service = moduleRef.get(UsersService);
    expect(service).toBeDefined();
  });
});

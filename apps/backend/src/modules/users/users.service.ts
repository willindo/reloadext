import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(data) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}

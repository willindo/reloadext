import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service'; // adjust path if needed

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Add more fields as needed, but do not expose password!
      },
    });
  }
}

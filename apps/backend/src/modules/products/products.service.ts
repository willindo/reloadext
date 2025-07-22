import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async list(page = 1, limit = 20) {
    return prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

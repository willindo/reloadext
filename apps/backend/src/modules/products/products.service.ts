import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

// const prisma = new PrismaClient(); not needed as we use PrismaService

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; limit: number; userId?: string }) {
    const { page, limit, userId } = params;

    console.log('📦 Fetching products with:', { page, limit, userId });

    const where = userId ? { userId } : {};

    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        userId: true,
      },
    });

    console.log('✅ Products found:', products.length);
    return products;
  }
  async create(data: { name: string; description?: string; price: number }) {
    // In real world, you'd get userId from auth
    const demoUser = await this.prisma.user.findFirst({
      where: { email: 'demo@example.com' },
    });
    if (!demoUser) throw new Error('Demo user not found');

    return this.prisma.product.create({
      data: {
        ...data,
        userId: demoUser.id,
      },
    });
  }
  async delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
  async update(
    id: string,
    data: { name: string; description?: string; price: number },
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}

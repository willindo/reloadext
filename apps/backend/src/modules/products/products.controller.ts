// apps/backend/src/modules/products/products.controller.ts
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Protected creation - use user id from JWT (req.user.id)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req) {
    const userId = req.user?.id;
    // explicitly build object sent to service/prisma
    return this.productsService.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      userId,
    });
  }

  // Public listing; optional userId query param to filter by owner
  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('userId') userId?: string,
  ) {
    return this.productsService.findAll(+page, +limit, { page: +page, limit: +limit, userId });
  }
}

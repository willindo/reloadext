import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('/hallo')
  getRoot(): string {
    return 'Welcome to the API waiting for!';
  }
  @Get()
  async listProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;

    return this.productsService.list(pageNum, limitNum);
  }
}

import { Body, Controller, Get, Post, Query,Param,Delete, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('userId') userId?: string
  ) {
    return this.productsService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      userId,
    });
  }
 
@Post()
async createProduct(@Body() body: any) {
  return this.productsService.create(body);
}
@Delete(':id')
async deleteProduct(@Param('id') id: string) {
  return this.productsService.delete(id);
}
@Put(':id')
async updateProduct(@Param('id') id: string, @Body() data: any) {
  return this.productsService.update(id, data);
}

}
 
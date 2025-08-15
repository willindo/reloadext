import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public: list all products (supports pagination)
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
     @Query('userId') userId?: string
  ) {
    return this.productsService.findAll(Number(page), Number(limit),userId);
  }

  // Authenticated: get current user's products
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req,
  ) {
    return this.productsService.findAll(Number(page), Number(limit), req.user.id);
  }

  // Authenticated: create new product
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  // Authenticated: update own product
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.id);
  }

  // Authenticated: delete own product
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.productsService.remove(id, req.user.id);
  }
}

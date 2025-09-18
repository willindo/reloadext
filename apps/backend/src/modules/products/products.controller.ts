// apps/backend/src/modules/products/products.controller.ts
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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { VerifiedSellerGuard } from 'src/common/guards/verified-seller-guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public: list all products (supports pagination & optional userId filter)
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
  ) {
    return this.productsService.findAll(Number(page), Number(limit), userId);
  }

  // Authenticated: get current user's products
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProducts(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.productsService.findAll(
      Number(page),
      Number(limit),
      req.user.id,
    );
  }

  // Authenticated & verified seller only: create product
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedSellerGuard)
  @Roles('SELLER')
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  // Authenticated & verified seller only: update own product
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedSellerGuard)
  @Roles('SELLER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.id);
  }

  // Authenticated & verified seller only: delete own product
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedSellerGuard)
  @Roles('SELLER')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.productsService.remove(id, req.user.id);
  }
}

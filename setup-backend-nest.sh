#!/bin/bash

echo "🚀 Setting up NestJS backend inside apps/backend"

cd apps/backend

# Install NestJS core dependencies
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @prisma/client prisma

mkdir -p src/modules/{auth,users,products}

echo "✅ Creating src/main.ts"
cat > src/main.ts <<EOF
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
EOF

echo "✅ Creating AppModule"
cat > src/app.module.ts <<EOF
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, ProductsModule],
})
export class AppModule {}
EOF

### === Auth ===

echo "✅ AuthModule"
cat > src/modules/auth/auth.module.ts <<EOF
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
EOF

cat > src/modules/auth/auth.service.ts <<EOF
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwt.sign(payload) };
  }

  async register(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.usersService.create({ ...data, password: hashed });
  }
}
EOF

cat > src/modules/auth/auth.controller.ts <<EOF
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) return { error: 'Invalid credentials' };
    return this.authService.login(user);
  }
}
EOF

### === Users ===

echo "✅ UsersModule"
cat > src/modules/users/users.module.ts <<EOF
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
EOF

cat > src/modules/users/users.service.ts <<EOF
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
EOF

### === Products ===

echo "✅ ProductsModule"
cat > src/modules/products/products.module.ts <<EOF
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
EOF

cat > src/modules/products/products.service.ts <<EOF
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
EOF

cat > src/modules/products/products.controller.ts <<EOF
import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  list(@Query('page') page: string) {
    return this.service.list(Number(page) || 1);
  }
}

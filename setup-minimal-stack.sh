#!/bin/bash

echo "🔧 Setting up minimal fullstack starter in reload-ops..."

# Step 1: Create folders
mkdir -p prisma
mkdir -p apps/backend/src/modules/{auth,users,products}
mkdir -p apps/frontend/pages/products
touch .env

# Step 2: Prisma schema
cat > prisma/schema.prisma <<EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  products  Product[]
  createdAt DateTime @default(now())
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
EOF

# Step 3: Root .env
cat > .env <<EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reload_db"
JWT_SECRET="supersecretkey"
EOF

# Step 4: NestJS basic setup
cd apps/backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt prisma @prisma/client
npx prisma generate

# Backend entrypoint
cat > src/main.ts <<EOF
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
EOF

# Backend AppModule
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

# AuthModule
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

# UsersModule
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

# ProductsModule
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
EOF

cd ../../..

# Step 5: Setup frontend (Next.js)
cd apps/frontend
npx create-next-app@latest . --ts --no-tailwind --app
npm install next-auth axios
mkdir lib
cat > lib/api.ts <<EOF
import axios from 'axios';
export const api = axios.create({ baseURL: 'http://localhost:3001' });
EOF

# Product page
cat > app/products/page.tsx <<EOF
'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products?page=1').then(res => setProducts(res.data))
  }, [])

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  )
}
EOF

cd ../../..

echo "✅ Setup complete! Next steps:"
echo "➡️  1. Start Postgres (localhost:5432)"
echo "➡️  2. Run: cd apps/backend && npx prisma migrate dev --name init && npm run start"
echo "➡️  3. Run: cd apps/frontend && npm run dev"

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service'; // adjust path if needed

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  // exports: [UsersService], // optional, if used elsewhere
})
export class UsersModule {}

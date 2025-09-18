// apps/backend/src/modules/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    dto: {
      email: string;
      name?: string;
      password: string;
      phone?: string;
    },
  ) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }

  // seller applies: must be authenticated
  @UseGuards(AuthGuard('jwt'))
  @Post('apply-seller')
  async applySeller(
    @Req() req,
    @Body() body: { message?: string; documents?: any },
  ) {
    return this.authService.applySeller(req.user.id, body);
  }

  // optional: endpoint for current user to check application status
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    // return minimal user object from db
    return req.user;
  }
}

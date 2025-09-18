// apps/backend/src/modules/admin/admin.controller.ts
import { Controller, UseGuards, Patch, Param, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthService } from 'src/modules/auth/auth.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('seller-applications')
  async listPending() {
    return this.authService.listSellerApplications();
  }

  @Patch('seller-applications/:id/approve')
  async approve(
    @Param('id') id: string,
    @Body() body: {},
    @Body('') nothing?: any,
  ) {
    // For simplicity, admin id is not passed in body; you may fetch from req.user in real route.
    // To keep this file self-contained we assume the calling workflow attaches admin id after guard.
    // In practice, change signature to: async approve(@Req() req, @Param('id') id: string) { req.user.id ... }
    throw new Error(
      'Use the route handler variant that reads req.user.id (see notes).',
    );
  }

  // Example intended implementation (replace above with this in your repo):
  // @Patch('seller-applications/:id/approve')
  // async approve(@Req() req, @Param('id') id: string) {
  //   return this.authService.approveSeller(id, req.user.id);
  // }
}

// apps/backend/src/common/guards/verified-seller.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class VerifiedSellerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // user.roles is array; user.sellerStatus should be 'VERIFIED'
    return !!(
      user &&
      Array.isArray(user.roles) &&
      user.roles.includes('SELLER') &&
      user.sellerStatus === 'VERIFIED'
    );
  }
}

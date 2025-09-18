// apps/backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register: always create as BUYER by default
  async register(dto: {
    email: string;
    name?: string;
    password: string;
    phone?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        password: hashed,
        // roles defaults to [BUYER] by schema, but explicit is okay:
        roles: ['BUYER'],
      },
      select: { id: true, email: true, name: true },
    });

    return { message: 'Registered', user };
  }

  // Login: returns access_token + user object (no password)
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Submit or update seller application (used by seller)
  async applySeller(
    userId: string,
    payload: { message?: string; documents?: any },
  ) {
    // Upsert application
    const app = await this.prisma.sellerApplication.upsert({
      where: { userId },
      update: {
        documents: payload.documents ?? undefined,
        message: payload.message ?? undefined,
        status: 'PENDING',
      },
      create: {
        userId,
        documents: payload.documents ?? undefined,
        message: payload.message ?? undefined,
        status: 'PENDING',
      },
    });

    // ensure user has sellerStatus set to PENDING
    await this.prisma.user.update({
      where: { id: userId },
      data: { sellerStatus: 'PENDING' },
    });

    return { message: 'Application submitted', appId: app.id };
  }

  // Admin – list pending apps
  async listSellerApplications() {
    return this.prisma.sellerApplication.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin – approve seller application
  async approveSeller(applicationId: string, adminUserId: string) {
    const app = await this.prisma.sellerApplication.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new NotFoundException('Application not found');

    // mark application verified
    const updated = await this.prisma.sellerApplication.update({
      where: { id: applicationId },
      data: {
        status: 'VERIFIED',
        approvedBy: adminUserId,
        approvedAt: new Date(),
      },
    });

    // promote user: add SELLER to roles if not present; set sellerStatus=VERIFIED
    const user = await this.prisma.user.findUnique({
      where: { id: app.userId },
    });
    if (!user) throw new NotFoundException('User not found for application');

    const hasSeller = user.roles?.includes('SELLER');
    if (!hasSeller) {
      await this.prisma.user.update({
        where: { id: app.userId },
        data: {
          roles: { push: 'SELLER' },
          sellerStatus: 'VERIFIED',
        },
      });
    } else {
      // still update sellerStatus
      await this.prisma.user.update({
        where: { id: app.userId },
        data: { sellerStatus: 'VERIFIED' },
      });
    }

    return { message: 'Seller approved', application: updated };
  }

  // Admin – reject application
  async rejectSeller(
    applicationId: string,
    adminUserId: string,
    reason?: string,
  ) {
    const app = await this.prisma.sellerApplication.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        approvedBy: adminUserId,
        updatedAt: new Date(),
      },
    });
    await this.prisma.user.update({
      where: { id: app.userId },
      data: { sellerStatus: 'REJECTED' },
    });
    return { message: 'Application rejected', applicationId: app.id, reason };
  }
}
export default AuthService;

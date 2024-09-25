import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/database/prisma.service';
import { AdminAuthGuard } from 'src/common/guard/admin.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Module({
  exports: [UserModule],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    JwtService,
    AdminAuthGuard,
    AuthGuard,
  ],
})
export class UserModule {}

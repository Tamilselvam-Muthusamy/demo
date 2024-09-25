import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/module/auth/auth.service';
import { PrismaService } from 'src/common/database/prisma.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, JwtService, AuthService],
})
export class ProjectModule {}

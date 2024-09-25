import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/module/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { PrismaService } from 'src/common/database/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, cb) {
          const destination = process.cwd() + '/public/task';
          if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
          }
          cb(null, destination);
        },
        filename(req, file, callback) {
          const customFileName = `${
            file.originalname.toLowerCase().split('.')[0]
          }-${new Date().toISOString()}.${
            file.originalname.toLowerCase().split('.')[1]
          }`;
          callback(null, customFileName);
        },
      }),
    }),
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    PrismaService,
    JwtService,
    AuthService,
    ConfigService,
  ],
})
export class TaskModule {}

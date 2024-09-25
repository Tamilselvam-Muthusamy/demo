import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProjectModule,
    TaskModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, `../../../public/task`),
      serveRoot: '/task',
    }),
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

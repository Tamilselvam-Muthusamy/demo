import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  getDashBoardCounts = async () => {
    const usersCount = await this.prismaService.user.count({
      where: { isActive: true },
    });
    const projectsCount = await this.prismaService.project.count({
      where: { isActive: true },
    });
    const taskCount = await this.prismaService.task.count({
      where: { isActive: true, typeId: 1 },
    });
    const bugsCount = await this.prismaService.task.count({
      where: { isActive: true, typeId: 2 },
    });
    const toDoCount = await this.prismaService.task.count({
      where: { isActive: true, statusId: 1 },
    });
    const inProgressCount = await this.prismaService.task.count({
      where: { isActive: true, statusId: 2 },
    });
    const resolvedCount = await this.prismaService.task.count({
      where: { isActive: true, statusId: 3 },
    });
    const reopenedCount = await this.prismaService.task.count({
      where: { isActive: true, statusId: 4 },
    });
    return {
      users: usersCount,
      projects: projectsCount,
      tasks: taskCount,
      bugs: bugsCount,
      toDo: toDoCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      reopened: reopenedCount,
    };
  };
}

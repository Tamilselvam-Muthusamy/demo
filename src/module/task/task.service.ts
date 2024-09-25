import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/utility/utility';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { TaskStatus } from 'src/common/enum/enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  createNewTask = async (taskDetails: CreateTaskDto, files: any[]) => {
    try {
      // const taskAssigneeId = [2];
      await this.prismaService.task.create({
        data: {
          title: taskDetails.title,
          description: taskDetails.description,
          projectId: +taskDetails.projectId,
          taskCreatorId: +taskDetails.taskCreatorId,
          typeId: +taskDetails.typeId,
          statusId: TaskStatus.ToDo, //by default the task or bug created will be under toto
          images: {
            create: files.map((file) => ({
              file: file.filename,
            })),
          },
          userOnTeams: {
            create: taskDetails.taskAssigneeId.map((teamMember) => ({
              projectId: +taskDetails.projectId,
              taskAssigneeId: +teamMember,
            })),
          },
          // userOnTeams: {
          //   create: taskAssigneeId.map((teamMember) => ({
          //     projectId: +taskDetails.projectId,
          //     taskAssigneeId: +teamMember,
          //   })),
          // },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  };

  allTasks = async (
    page: number,
    search: string,
    type: number,
    status: number,
    id: number,
    user: number,
  ) => {
    try {
      const filter: Prisma.TaskWhereInput = {
        projectId: id,
        typeId: type != 0 ? type : undefined,
        statusId: status != 0 ? status : undefined,
        userOnTeams:
          user == 0 || null ? undefined : { some: { taskAssigneeId: user } },
        OR:
          search != null || ''
            ? [
                { title: { contains: search } },
                { description: { contains: search } },
                {
                  userOnTeams: {
                    some: {
                      assignees: {
                        firstName: { contains: search },
                        lastName: { contains: search },
                        phoneNumber: { contains: search },
                        email: { contains: search },
                      },
                    },
                  },
                },
              ]
            : undefined,
      };

      const totalCount = await this.prismaService.task.count({
        where: filter,
      });

      const tasks = await this.prismaService.task.findMany({
        skip: page == 1 || page == 0 ? 0 : (page - 1) * 10,
        take: page == 0 ? undefined : 10,
        where: filter,
        include: {
          images: {
            where: { isActive: true },
            select: { id: true, file: true },
          },
          userOnTeams: {
            where: { isActive: true },
            select: {
              id: true,
              assignees: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });

      return await Pagination(page, tasks, totalCount);
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  };

  editTask = async (
    id: number,
    updateTaskDetails: UpdateTaskDto,
    files: any[],
  ) => {
    try {
      if (files.length > 0) {
        await this.prismaService.taskImages.updateMany({
          where: {
            taskId: id,
            isActive: true,
          },
          data: { isActive: false },
        });
      }
      await this.prismaService.userOnTasks.updateMany({
        where: {
          taskId: id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
      await this.prismaService.task.update({
        where: { id: id },
        data: {
          title: updateTaskDetails.title,
          description: updateTaskDetails.description,
          statusId: updateTaskDetails.status,
          images: {
            create: files.map((file) => ({ file: file.filename })),
          },
          typeId: updateTaskDetails.typeId,
          userOnTeams: {
            create: updateTaskDetails.taskAssigneeId.map((teamMember) => ({
              projectId: +updateTaskDetails.projectId,
              taskAssigneeId: +teamMember,
            })),
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  };

  deleteImageFromTask = async (imageId: number) => {
    await this.prismaService.taskImages.updateMany({
      where: {
        id: imageId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  };
}

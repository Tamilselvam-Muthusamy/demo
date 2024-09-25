import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/utility/utility';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  createNewProject = async (projectDetails: CreateProjectDto) => {
    try {
      await this.prisma.project.create({
        data: {
          title: projectDetails.title,
          description: projectDetails.description,
          projectCreatorId: projectDetails.projectCreatorId,
        },
      });

      return {
        status: true,
        message: 'Project created successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  };

  fetchAllProjects = async (page: number, search: string) => {
    try {
      const projectWhereCondition: Prisma.ProjectWhereInput = {
        isActive: true,
        OR:
          search != null || ''
            ? [
                { title: { contains: search } },
                { description: { contains: search } },
              ]
            : undefined,
      };

      const totalCount = await this.prisma.project.count({
        where: projectWhereCondition,
      });

      const allProjects = await this.prisma.project.findMany({
        skip: page == 1 || page == 0 ? 0 : (page - 1) * 10,
        take: page == 0 ? undefined : 10,
        where: projectWhereCondition,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return await Pagination(page, allProjects, totalCount);
    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }
  };

  async editProject(id: number, updateProjectDetails: UpdateProjectDto) {
    try {
      const existingProject = await this.prisma.project.findUnique({
        where: { id: id },
        select: {
          title: true,
          description: true,
          projectCreatorId: true,
        },
      });

      if (!existingProject) {
        throw new BadRequestException('Project not found');
      }

      await this.prisma.project.update({
        where: { id: id },
        data: {
          title: updateProjectDetails.title,
          description: updateProjectDetails.description,
          projectCreatorId: updateProjectDetails.projectCreatorId,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

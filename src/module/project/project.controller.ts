import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { AdminAuthGuard } from 'src/common/guard/admin.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @UseGuards(AdminAuthGuard)
  async createNewProject(@Body() projectDetails: CreateProjectDto) {
    await this.projectService.createNewProject(projectDetails);

    return {
      status: true,
      message: 'Project created successfully',
    };
  }

  @Get('')
  @UseGuards(AuthGuard)
  async projects(@Query('page') page: number, @Query('search') search: string) {
    const result = await this.projectService.fetchAllProjects(page, search);

    return {
      status: true,
      data: result,
      message: 'Projects fetched successfully',
    };
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async editProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDetails: UpdateProjectDto,
  ) {
    await this.projectService.editProject(id, updateProjectDetails);

    return {
      status: true,
      message: 'Project edited successfully',
    };
  }
}

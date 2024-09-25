import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async taskCreate(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() taskDetails: CreateTaskDto,
  ) {
    await this.taskService.createNewTask(taskDetails, files);
    return {
      status: true,
      message: 'Task created successfully',
    };
  }

  @Get('all/:id')
  @UseGuards(AuthGuard)
  allTasks(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('type', ParseIntPipe) type: number,
    @Query('status', ParseIntPipe) status: number,
    @Query('user') user: number,
    @Query('search') search: string,
  ) {
    console.log(
      'page ',
      page,
      'search',
      search,
      'type',
      type,
      'status',
      status,
      'id',
      id,
      'userId',
      user,
    );

    return this.taskService.allTasks(page, search, type, status, id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async editTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDetails: UpdateTaskDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.taskService.editTask(id, updateTaskDetails, files);
    return {
      status: true,
      message: 'Task updated successfully',
    };
  }

  @Patch('image/:id')
  @UseGuards(AuthGuard)
  async deleteImageFromTask(@Param('id', ParseIntPipe) id: number) {
    await this.taskService.deleteImageFromTask(id);
  }
}

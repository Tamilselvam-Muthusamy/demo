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
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { AdminAuthGuard } from 'src/common/guard/admin.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';

//@UseGuards()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  //@UseGuards(AdminAuthGuard)
  async createNewUser(@Body() userDetail: CreateUserDto) {
    const result = await this.userService.createNewUser(userDetail);
    return { status: true, data: result, message: 'User created successfully' };
  }

  @Get('')
  //@UseGuards(AuthGuard)
  async findAllUser(
    @Query('search') search: string,
    @Query('page') page: number,
  ) {
    //const result = await this.userService.findAllUsers();
    const result = await this.userService.findAllUsers(page, search);
    return {
      status: true,
      data: result,
      message: 'Users fetched successfully',
    };
  }

  @Patch(':id')
  //@UseGuards(AdminAuthGuard)
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() alterUserDetails: UpdateUserDto,
  ) {
    await this.userService.editUser(id, alterUserDetails);

    return {
      status: true,
      message: 'User details edited successfully',
    };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/common/utility/utility';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createNewUser(userDetail: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(userDetail.password, 10);

      return await this.prisma.user.create({
        data: {
          firstName: userDetail.firstName,
          lastName: userDetail.lastName,
          email: userDetail.email,
          phoneNumber: userDetail.phoneNumber,
          password: hash,
          role: userDetail.role,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `User with this ${error.meta.target[0]} already exists`,
        );
      } else {
        throw new BadRequestException(`Error: ${error.message}`);
      }
    }
  }

  findAllUsers = async (page: number, search: string) => {
    //findAllUsers = async () => {
    try {
      const filter: Prisma.UserWhereInput = {
        isActive: true,
        OR:
          search != null || ''
            ? [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { phoneNumber: { contains: search } },
              ]
            : undefined,
      };
      const totalCount = await this.prisma.user.count({
        where: filter,
      });
      const users = await this.prisma.user.findMany({
        skip: page == 1 || page == 0 ? 0 : (page - 1) * 10,
        take: page == 0 ? undefined : 10,
        where: filter,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          projects: {
            where: { isActive: true },
            select: { id: true, title: true, description: true },
          },
          userOnTeams: {
            where: { isActive: true },
            select: {
              id: true,
              task: {
                select: {
                  id: true,
                  title: true,
                  project: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      });
      return await Pagination(page, users, totalCount);

      //return await this.prisma.user.findMany({});
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  };

  editUser = async (id: number, alterUserDetails: UpdateUserDto) => {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { id: id },
      });

      if (!existingUser) {
        throw new UnauthorizedException('User not found');
      }

      await this.prisma.user.update({
        where: { id: id },
        data: {
          firstName: alterUserDetails.firstName,
          lastName: alterUserDetails.lastName,
          email: alterUserDetails.email,
          phoneNumber: alterUserDetails.phoneNumber,
          role: alterUserDetails.role,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  };
}

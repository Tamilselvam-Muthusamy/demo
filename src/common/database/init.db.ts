import { Role } from '../enum/enum';
import { taskStatus } from '../utility/taskStatus';
import { taskType } from '../utility/taskType';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

async function initAdmin(prisma: PrismaService) {
  //creating a admin user with following credentials if there are no users while initializing
  const hashedPassword = await bcrypt.hash('Tamil#2000', 10);
  const userCount = await prisma.user.count({});
  if (userCount == 0) {
    await prisma.user.create({
      data: {
        firstName: 'Tamil',
        lastName: 'Selvam M',
        email: 'tamilselvammuthuswamy@gmail.com',
        phoneNumber: '9999999999',
        password: hashedPassword,
        role: Role.Admin,
      },
    });
  }
}

async function initTaskType(prisma: PrismaService) {
  const typeCount = await prisma.type.count({});
  if (typeCount == 0) {
    for (const typeOfTask of taskType) {
      await prisma.type.create({
        data: {
          type: typeOfTask,
        },
      });
    }
  }
}

async function initTaskStatus(prisma: PrismaService) {
  const taskStatusCount = await prisma.status.count({});

  if (taskStatusCount == 0) {
    for (const statusName of taskStatus) {
      await prisma.status.create({
        data: {
          type: statusName,
        },
      });
    }
  }
}

async function initDatabase(prisma: PrismaService) {
  try {
    await initAdmin(prisma);
    await initTaskType(prisma);
    await initTaskStatus(prisma);
  } catch (error) {
    console.log(error);
  }
}

export default initDatabase;

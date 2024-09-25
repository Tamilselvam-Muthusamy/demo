import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Config } from 'src/common/config/config';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signIn = async (credentials: LoginAuthDto) => {
    const user = await this.prisma.user.findFirst({
      where: { email: credentials.email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Not a registered user');
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match');
    }

    const signInToken = sign({ userId: user.id }, Config.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return await this.prisma.user.update({
      where: { id: user.id },
      data: { token: signInToken },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        token: true,
      },
    });
  };
}

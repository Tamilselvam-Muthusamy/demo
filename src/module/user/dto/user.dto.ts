import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/common/enum/enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]{1,29}$')
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]{1,29}$')
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^\\d{10}$')
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,20})')
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

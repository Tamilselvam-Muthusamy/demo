import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  taskCreatorId: number;

  @IsNumberString({}, { each: true })
  taskAssigneeId: number[];

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  typeId: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  status: number;
}

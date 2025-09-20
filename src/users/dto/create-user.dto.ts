import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ['patient', 'doctor', 'admin'], required: false })
  @IsOptional()
  @IsEnum(['patient', 'doctor', 'admin'])
  role?: 'patient' | 'doctor' | 'admin';

  @ApiProperty({ required: false })
  @IsOptional()
  profile?: Record<string, unknown>;
}


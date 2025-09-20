import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['in-progress', 'completed', 'cancelled'])
  status?: 'in-progress' | 'completed' | 'cancelled';
}


import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  medicalHistory?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  currentMedications?: string[];

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  emergencyContact?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}


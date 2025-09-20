import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class SubmitConsultationDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  patientInfo!: {
    fullName: string;
    age?: number;
    gender?: string;
    phone?: string;
    medicalHistory: string[];
    allergies?: string;
    medications?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  selectedSymptoms!: string[];

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  symptomDetails!: {
    severity?: number;
    duration?: string;
    details?: string;
  };

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  followupAnswers!: Record<string, string>;
}

export class ConsultationResponseDto {
  @ApiProperty()
  consultationId!: string;

  @ApiProperty()
  riskAssessment!: {
    level: 'Low' | 'Medium' | 'High' | 'Emergency';
    factors: string[];
    score: number;
  };

  @ApiProperty()
  recommendations!: string[];

  @ApiProperty()
  nextSteps!: string[];

  @ApiProperty()
  urgency!: {
    requiresImmediateAttention: boolean;
    timeframe?: string;
    instructions?: string;
  };
}

import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Consultation, ConsultationSchema } from './schemas/consultation.schema';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consultation.name, schema: ConsultationSchema }]),
    RiskModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService]
})
export class ConsultationsModule {}

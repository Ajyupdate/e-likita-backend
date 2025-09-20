import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferenceService } from './reference.service';
import { ReferenceController } from './reference.controller';
import { MedicalHistoryOption, MedicalHistoryOptionSchema } from './schemas/medical-history-option.schema';
import { SymptomOption, SymptomOptionSchema } from './schemas/symptom-option.schema';
import { FollowupQuestion, FollowupQuestionSchema } from './schemas/followup-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalHistoryOption.name, schema: MedicalHistoryOptionSchema },
      { name: SymptomOption.name, schema: SymptomOptionSchema },
      { name: FollowupQuestion.name, schema: FollowupQuestionSchema },
    ]),
  ],
  controllers: [ReferenceController],
  providers: [ReferenceService],
  exports: [ReferenceService],
})
export class ReferenceModule {}


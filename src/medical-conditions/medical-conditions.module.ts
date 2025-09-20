import { Module } from '@nestjs/common';
import { MedicalConditionsController } from './medical-conditions.controller';
import { MedicalConditionsService } from './medical-conditions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Condition, ConditionSchema } from './schemas/condition.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Condition.name, schema: ConditionSchema }])],
  controllers: [MedicalConditionsController],
  providers: [MedicalConditionsService]
})
export class MedicalConditionsModule {}

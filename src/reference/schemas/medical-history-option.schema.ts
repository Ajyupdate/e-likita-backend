import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedicalHistoryOptionDocument = HydratedDocument<MedicalHistoryOption>;

@Schema({ timestamps: true })
export class MedicalHistoryOption {
  @Prop({ unique: true })
  key!: string;

  @Prop({ required: true })
  label!: string;
}

export const MedicalHistoryOptionSchema = SchemaFactory.createForClass(MedicalHistoryOption);


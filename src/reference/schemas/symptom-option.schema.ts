import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SymptomOptionDocument = HydratedDocument<SymptomOption>;

@Schema({ timestamps: true })
export class SymptomOption {
  @Prop({ unique: true })
  key!: string;

  @Prop({ required: true })
  label!: string;
}

export const SymptomOptionSchema = SchemaFactory.createForClass(SymptomOption);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SymptomDocument = HydratedDocument<Symptom>;

@Schema({ timestamps: true })
export class Symptom {
  @Prop({ type: Types.ObjectId, ref: 'Consultation', index: true })
  consultationId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  location?: string; // body location

  @Prop({ min: 1, max: 10 })
  severity?: number;

  @Prop({ required: false })
  duration?: string; // e.g., '2 days'
}

export const SymptomSchema = SchemaFactory.createForClass(Symptom);


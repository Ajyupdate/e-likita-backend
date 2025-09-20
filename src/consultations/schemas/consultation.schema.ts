import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConsultationDocument = HydratedDocument<Consultation>;

@Schema({ _id: false })
class StepsSchema {
  @Prop({ type: Object }) patientInfo?: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) symptoms?: Record<string, unknown>[];
  @Prop({ type: Object }) followUpAnswers?: Record<string, unknown>;
  @Prop({ type: Object }) riskAssessment?: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) recommendations?: string[];
}

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ type: Types.ObjectId, ref: 'Patient', index: true })
  patientId!: Types.ObjectId;

  @Prop({ unique: true, index: true })
  consultationNumber!: string;

  @Prop({ enum: ['in-progress', 'completed', 'cancelled'], default: 'in-progress' })
  status!: 'in-progress' | 'completed' | 'cancelled';

  @Prop({ type: StepsSchema, default: {} })
  steps!: StepsSchema;

  @Prop()
  completedAt?: Date;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ _id: false })
class EmergencyContact {
  @Prop() name?: string;
  @Prop() relationship?: string;
  @Prop() phone?: string;
}

@Schema({ timestamps: true })
export class Patient {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop() dateOfBirth?: Date;

  @Prop() gender?: string;

  @Prop() phone?: string;

  @Prop() email?: string;

  @Prop({ type: [String], default: [] })
  medicalHistory!: string[];

  @Prop({ type: [String], default: [] })
  currentMedications!: string[];

  @Prop({ type: EmergencyContact })
  emergencyContact?: EmergencyContact;

  @Prop() addressLine1?: string;
  @Prop() addressLine2?: string;
  @Prop() city?: string;
  @Prop() state?: string;
  @Prop() postalCode?: string;
  @Prop() country?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);


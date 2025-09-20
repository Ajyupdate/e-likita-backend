import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConditionDocument = HydratedDocument<Condition>;

@Schema({ timestamps: true })
export class Condition {
  @Prop({ required: true, unique: true })
  code!: string; // e.g., ICD-10 code

  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  description?: string;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);


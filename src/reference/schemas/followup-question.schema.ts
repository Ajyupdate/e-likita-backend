import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FollowupQuestionDocument = HydratedDocument<FollowupQuestion>;

@Schema({ timestamps: true })
export class FollowupQuestion {
  @Prop({ index: true })
  symptomKey!: string;

  @Prop({ required: true })
  question!: string;
}

export const FollowupQuestionSchema = SchemaFactory.createForClass(FollowupQuestion);


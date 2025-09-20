import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
class Address {
  @Prop() line1?: string;
  @Prop() line2?: string;
  @Prop() city?: string;
  @Prop() state?: string;
  @Prop() postalCode?: string;
  @Prop() country?: string;
}

@Schema({ _id: false })
class Profile {
  @Prop() firstName?: string;
  @Prop() lastName?: string;
  @Prop() dateOfBirth?: Date;
  @Prop() gender?: string;
  @Prop() phone?: string;
  @Prop({ type: Address }) address?: Address;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, index: true, required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string; // hashed

  @Prop({ enum: ['patient', 'doctor', 'admin'], default: 'patient' })
  role!: 'patient' | 'doctor' | 'admin';

  @Prop({ type: Profile })
  profile?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);


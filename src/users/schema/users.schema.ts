import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'USER' }) // Por defecto, el rol es 'USER'
  role: 'USER' | 'USER_PREMIUM' | 'ADMIN'; // Define los roles posibles
}

export const UserSchema = SchemaFactory.createForClass(User);

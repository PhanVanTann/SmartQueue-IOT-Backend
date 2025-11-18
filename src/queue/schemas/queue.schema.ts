import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Queue extends Document {
  @Prop({ required: true })
  number: number;

  @Prop({ default: 'button' })
  source: string; 

  @Prop({ default: 'waiting' })
  status: string;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
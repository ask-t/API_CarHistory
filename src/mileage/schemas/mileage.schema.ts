import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MileageDocument = Mileage & HydratedDocument<Mileage>;

@Schema()
export class Mileage {
  @Prop()
  from: number;
  @Prop()
  to: number;
  @Prop()
  miles: number;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  total: number;
  @Prop()
  gas: boolean;
  @Prop()
  gasID: string;
  @Prop()
  cost: number;
  @Prop()
  totalCost: number;
  @Prop()
  user: string;
  @Prop()
  description: string;
}
export const MileageSchema = SchemaFactory.createForClass(Mileage);

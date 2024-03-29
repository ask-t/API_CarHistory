import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GasIDDocument = GasID & HydratedDocument<GasID>;

@Schema()
export class GasID {
  [x: string]: any;
  @Prop()
  totalMile: number;
  @Prop()
  totalCost: number;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  IDs: [string];
  @Prop()
  finish: boolean;
}
export const GasIDSchema = SchemaFactory.createForClass(GasID);

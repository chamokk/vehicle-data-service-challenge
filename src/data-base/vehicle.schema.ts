import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VehicleType {
  @Prop({ required: true, type: Number })
  VehicleTypeId: number;

  @Prop({ required: true })
  VehicleTypeName: string;
}

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
  @Prop({ required: true, unique: true, type: Number })
  Make_ID: number;

  @Prop({ required: true })
  Make_Name: string;

  @Prop([VehicleType])
  VehicleTypes: VehicleType[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataBaseService } from './data-base.service';
import { Vehicle, VehicleSchema } from './vehicle.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/vehicleDB', {
      writeConcern: {
        w: 1,
        j: false,
      },
    }),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService, MongooseModule],
})
export class DataBaseModule {}
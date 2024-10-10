import { Module } from '@nestjs/common';
import { VehicleResolver } from './vehicle.resolver';
import { DataBaseModule } from '../data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  providers: [VehicleResolver],
})
export class VehicleModule {}
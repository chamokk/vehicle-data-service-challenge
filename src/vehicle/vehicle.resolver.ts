import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { DataBaseService } from '../data-base/data-base.service';
import { Vehicle } from './vehicle.model';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private dataBaseService: DataBaseService) {}

  @Query(() => [Vehicle], { name: 'vehicles' })
  async getAllVehicles() {
    return this.dataBaseService.getAllVehicles();
  }

  @Query(() => Vehicle, { name: 'vehicle', nullable: true })
  async getVehicle(@Args('makeId', { type: () => Int }) makeId: number) {
    return this.dataBaseService.getVehicleByMakeId(makeId);
  }
}
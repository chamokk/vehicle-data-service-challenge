import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './vehicle.schema';

@Injectable()
export class DataBaseService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>
  ) {}

  async saveVehicleData(vehicleData: any): Promise<Vehicle> {
    return this.vehicleModel.create(vehicleData);
  }

  async saveManyVehicles(vehiclesData: any[]): Promise<Vehicle[]> {
    const savedVehicles = await this.vehicleModel.insertMany(vehiclesData, { ordered: false });
    return savedVehicles.map(vehicle => ({
      Make_ID: vehicle.Make_ID,
      Make_Name: vehicle.Make_Name,
      VehicleTypes: vehicle.VehicleTypes,
      ...vehicle.toObject()
    }));
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleModel.find().exec();
    return vehicles.map(vehicle => ({
      Make_ID: vehicle.Make_ID,
      Make_Name: vehicle.Make_Name,
      VehicleTypes: vehicle.VehicleTypes,
      ...vehicle.toObject()
    }));
  }

  async getVehicleByMakeId(makeId: number): Promise<Vehicle | null> {
    return this.vehicleModel.findOne({ Make_ID: makeId }).exec();
  }
}
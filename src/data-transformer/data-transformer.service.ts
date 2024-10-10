import { Injectable } from '@nestjs/common';
import { XmlParserService } from '../xml-parser/xml-parser.service';
import { DataBaseService } from '../data-base/data-base.service';

@Injectable()
export class DataTransformerService {
  constructor(
    private xmlParserService: XmlParserService,
    private dataBaseService: DataBaseService,
  ) {}

  async transformAndSaveAllData(): Promise<void> {
    const allMakes = await this.xmlParserService.getAllMakes();
    
    for (const make of allMakes) {
      const vehicleTypes = await this.xmlParserService.getVehicleTypesForMake(make.Make_ID);
      
      const transformedData = {
        Make_ID: parseInt(make.Make_ID),
        Make_Name: make.Make_Name,
        VehicleTypes: vehicleTypes.map(vt => ({
          VehicleTypeId: parseInt(vt.VehicleTypeId),
          VehicleTypeName: vt.VehicleTypeName,
        })),
      };

      await this.dataBaseService.saveVehicleData(transformedData);
    }
  }
}
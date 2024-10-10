import { Test, TestingModule } from '@nestjs/testing';
import { DataTransformerService } from './data-transformer.service';
import { XmlParserService } from '../xml-parser/xml-parser.service';
import { DataBaseService } from '../data-base/data-base.service';

describe('DataTransformerService', () => {
  let service: DataTransformerService;
  let xmlParserService: jest.Mocked<XmlParserService>;
  let dataBaseService: jest.Mocked<DataBaseService>;

  beforeEach(async () => {
    const xmlParserServiceMock = {
      getAllMakes: jest.fn(),
      getVehicleTypesForMake: jest.fn(),
    };

    const dataBaseServiceMock = {
      saveVehicleData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataTransformerService,
        { provide: XmlParserService, useValue: xmlParserServiceMock },
        { provide: DataBaseService, useValue: dataBaseServiceMock },
      ],
    }).compile();

    service = module.get<DataTransformerService>(DataTransformerService);
    xmlParserService = module.get(XmlParserService) as jest.Mocked<XmlParserService>;
    dataBaseService = module.get(DataBaseService) as jest.Mocked<DataBaseService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transformAndSaveAllData', () => {
    it('should transform and save data for all makes', async () => {
      const mockMakes = [
        { Make_ID: '1', Make_Name: 'Toyota' },
        { Make_ID: '2', Make_Name: 'Honda' },
      ];
      const mockVehicleTypes = [
        { VehicleTypeId: '1', VehicleTypeName: 'Passenger Car' },
        { VehicleTypeId: '2', VehicleTypeName: 'Truck' },
      ];

      xmlParserService.getAllMakes.mockResolvedValue(mockMakes);
      xmlParserService.getVehicleTypesForMake.mockResolvedValue(mockVehicleTypes);
      dataBaseService.saveVehicleData.mockResolvedValue(undefined);

      await service.transformAndSaveAllData();

      expect(xmlParserService.getAllMakes).toHaveBeenCalledTimes(1);
      expect(xmlParserService.getVehicleTypesForMake).toHaveBeenCalledTimes(2);
      expect(xmlParserService.getVehicleTypesForMake).toHaveBeenCalledWith('1');
      expect(xmlParserService.getVehicleTypesForMake).toHaveBeenCalledWith('2');
      expect(dataBaseService.saveVehicleData).toHaveBeenCalledTimes(2);
      expect(dataBaseService.saveVehicleData).toHaveBeenCalledWith({
        Make_ID: 1,
        Make_Name: 'Toyota',
        VehicleTypes: [
          { VehicleTypeId: 1, VehicleTypeName: 'Passenger Car' },
          { VehicleTypeId: 2, VehicleTypeName: 'Truck' },
        ],
      });
      expect(dataBaseService.saveVehicleData).toHaveBeenCalledWith({
        Make_ID: 2,
        Make_Name: 'Honda',
        VehicleTypes: [
          { VehicleTypeId: 1, VehicleTypeName: 'Passenger Car' },
          { VehicleTypeId: 2, VehicleTypeName: 'Truck' },
        ],
      });
    });

    it('should handle empty data gracefully', async () => {
      xmlParserService.getAllMakes.mockResolvedValue([]);

      await service.transformAndSaveAllData();

      expect(xmlParserService.getAllMakes).toHaveBeenCalledTimes(1);
      expect(xmlParserService.getVehicleTypesForMake).not.toHaveBeenCalled();
      expect(dataBaseService.saveVehicleData).not.toHaveBeenCalled();
    });

    it('should throw an error if getAllMakes fails', async () => {
      const error = new Error('Failed to get makes');
      xmlParserService.getAllMakes.mockRejectedValue(error);

      await expect(service.transformAndSaveAllData()).rejects.toThrow('Failed to get makes');
    });
  });
});

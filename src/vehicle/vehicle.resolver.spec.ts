import { Test, TestingModule } from '@nestjs/testing';
import { VehicleResolver } from './vehicle.resolver';
import { DataBaseService } from '../data-base/data-base.service';

describe('VehicleResolver', () => {
  let resolver: VehicleResolver;
  let dataBaseService: jest.Mocked<DataBaseService>;

  beforeEach(async () => {
    const mockDataBaseService = {
      getAllVehicles: jest.fn(),
      getVehicleByMakeId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleResolver,
        { provide: DataBaseService, useValue: mockDataBaseService },
      ],
    }).compile();

    resolver = module.get<VehicleResolver>(VehicleResolver);
    dataBaseService = module.get(DataBaseService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllVehicles', () => {
    it('should return an array of vehicles', async () => {
      const mockVehicles = [{ Make_ID: 1, Make_Name: 'Test Make', VehicleTypes: [] }];
      dataBaseService.getAllVehicles.mockResolvedValue(mockVehicles);

      const result = await resolver.getAllVehicles();

      expect(result).toEqual(mockVehicles);
      expect(dataBaseService.getAllVehicles).toHaveBeenCalled();
    });

  });

  describe('getVehicle', () => {
    it('should return a vehicle by makeId', async () => {
      const mockVehicle = { Make_ID: 1, Make_Name: 'Test Vehicle', VehicleTypes: [] };
      dataBaseService.getVehicleByMakeId.mockResolvedValue(mockVehicle);

      const result = await resolver.getVehicle(1);

      expect(result).toEqual(mockVehicle);
      expect(dataBaseService.getVehicleByMakeId).toHaveBeenCalledWith(1);
    });

    it('should return null if vehicle is not found', async () => {
      dataBaseService.getVehicleByMakeId.mockResolvedValue(null);

      const result = await resolver.getVehicle(999);

      expect(result).toBeNull();
      expect(dataBaseService.getVehicleByMakeId).toHaveBeenCalledWith(999);
    });

  });
});

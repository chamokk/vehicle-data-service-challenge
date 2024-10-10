import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataBaseService } from './data-base.service';
import { Vehicle, VehicleDocument } from './vehicle.schema';

describe('DataBaseService', () => {
  let service: DataBaseService;
  let model: Model<VehicleDocument>;

  const mockVehicle = {
    Make_ID: 1,
    Make_Name: 'Test Make',
    VehicleTypes: [{ VehicleTypeId: 1, VehicleTypeName: 'Test Type' }],
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataBaseService,
        {
          provide: getModelToken(Vehicle.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockVehicle),
            find: jest.fn(),
            findOne: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DataBaseService>(DataBaseService);
    model = module.get<Model<VehicleDocument>>(getModelToken(Vehicle.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveVehicleData', () => {
    it('should save a single vehicle', async () => {
      const result = await service.saveVehicleData(mockVehicle);
      expect(result).toEqual(mockVehicle);
      expect(model.create).toHaveBeenCalledWith(mockVehicle);
    });
  });

  describe('saveManyVehicles', () => {
    it('should save multiple vehicles', async () => {
      const mockVehicles = [mockVehicle, { ...mockVehicle, Make_ID: 2 }];
      (model.insertMany as jest.Mock).mockResolvedValueOnce(mockVehicles);

      const result = await service.saveManyVehicles(mockVehicles);
      expect(result).toEqual(mockVehicles);
      expect(model.insertMany).toHaveBeenCalledWith(mockVehicles, { ordered: false });
    });
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles', async () => {
      const mockVehicles = [mockVehicle, { ...mockVehicle, Make_ID: 2 }];
      (model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockVehicles),
      });

      const result = await service.getAllVehicles();
      expect(result).toEqual(mockVehicles);
    });
  });

  describe('getVehicleByMakeId', () => {
    it('should return a vehicle by Make_ID', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockVehicle),
      });

      const result = await service.getVehicleByMakeId(1);
      expect(result).toEqual(mockVehicle);
      expect(model.findOne).toHaveBeenCalledWith({ Make_ID: 1 });
    });

    it('should return null if vehicle is not found', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await service.getVehicleByMakeId(999);
      expect(result).toBeNull();
    });
  });
});

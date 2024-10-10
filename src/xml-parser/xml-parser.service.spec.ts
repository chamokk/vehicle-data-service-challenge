import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { XmlParserService } from './xml-parser.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('XmlParserService', () => {
  let service: XmlParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XmlParserService],
    }).compile();

    service = module.get<XmlParserService>(XmlParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndParseXml', () => {
    it('should fetch and parse XML successfully', async () => {
      const mockXmlData = '<Response><Results><Item>Test</Item></Results></Response>';
      mockedAxios.get.mockResolvedValue({ data: mockXmlData });

      const result = await service.fetchAndParseXml('http://test.com');
      expect(result).toEqual({ Response: { Results: { Item: 'Test' } } });
    });

    it('should throw HttpException on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.fetchAndParseXml('http://test.com')).rejects.toThrow(HttpException);
    });
  });

  describe('getAllMakes', () => {
    it('should return an array of makes', async () => {
      const mockResponse = {
        Response: {
          Results: {
            AllVehicleMakes: [
              { Make_ID: '1', Make_Name: 'Test Make 1' },
              { Make_ID: '2', Make_Name: 'Test Make 2' },
            ],
          },
        },
      };
      jest.spyOn(service, 'fetchAndParseXml').mockResolvedValue(mockResponse);

      const result = await service.getAllMakes();
      expect(result).toEqual([
        { Make_ID: '1', Make_Name: 'Test Make 1' },
        { Make_ID: '2', Make_Name: 'Test Make 2' },
      ]);
    });

    it('should handle single make result', async () => {
      const mockResponse = {
        Response: {
          Results: {
            AllVehicleMakes: { Make_ID: '1', Make_Name: 'Test Make 1' },
          },
        },
      };
      jest.spyOn(service, 'fetchAndParseXml').mockResolvedValue(mockResponse);

      const result = await service.getAllMakes();
      expect(result).toEqual([{ Make_ID: '1', Make_Name: 'Test Make 1' }]);
    });
  });

  describe('getVehicleTypesForMake', () => {
    it('should return vehicle types for a make', async () => {
      const mockResponse = {
        Response: {
          Results: {
            VehicleTypesForMakeIds: [
              { VehicleTypeId: '1', VehicleTypeName: 'Car' },
              { VehicleTypeId: '2', VehicleTypeName: 'Truck' },
            ],
          },
        },
      };
      jest.spyOn(service, 'fetchAndParseXml').mockResolvedValue(mockResponse);

      const result = await service.getVehicleTypesForMake('123');
      expect(result).toEqual([
        { VehicleTypeId: '1', VehicleTypeName: 'Car' },
        { VehicleTypeId: '2', VehicleTypeName: 'Truck' },
      ]);
    });
  });
});

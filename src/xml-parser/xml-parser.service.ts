import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlParserService {
  private parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

  async fetchAndParseXml(url: string): Promise<any> {
    try {
      const response = await axios.get(url, { timeout: 20000 }); // 20 second timeout
      return this.parser.parseStringPromise(response.data);
    } catch (error) {
      console.error(`Error fetching or parsing XML from ${url}:`, error instanceof Error ? error.message : String(error));
      throw new HttpException('Failed to fetch or parse XML', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllMakes(): Promise<any[]> {
    const url = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML';
    const result = await this.fetchAndParseXml(url);
    const allMakes = result.Response.Results.AllVehicleMakes;
    return Array.isArray(allMakes) ? allMakes : [allMakes];
  }

  async getVehicleTypesForMake(makeId: string): Promise<any[]> {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=xml`;
    const result = await this.fetchAndParseXml(url);
    const vehicleTypes = result.Response.Results.VehicleTypesForMakeIds;
    return vehicleTypes
  }
}
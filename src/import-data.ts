import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { XmlParserService } from './xml-parser/xml-parser.service';
import { DataBaseService } from './data-base/data-base.service';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processMake(make: any, xmlParserService: XmlParserService): Promise<any> {
  let retries = 5;
  let delay = 2000;
  // Adding some delay to the request to not stress the api
  while (retries > 0) {
    try {
      const vehicleTypesXml = await xmlParserService.getVehicleTypesForMake(make.Make_ID);

      if (!vehicleTypesXml) {
        console.warn(`No vehicle types found for Make_ID: ${make.Make_ID}`);
        return null;
      }
      
      const vehicleTypesArray = Array.isArray(vehicleTypesXml) ? vehicleTypesXml : [vehicleTypesXml];
      
      return {
        Make_ID: parseInt(make.Make_ID),
        Make_Name: make.Make_Name,
        VehicleTypes: vehicleTypesArray.map(vt => ({
          VehicleTypeId: parseInt(vt.VehicleTypeId),
          VehicleTypeName: vt.VehicleTypeName,
        })),
      };
    } catch (error) {
      console.error(`Error processing Make_ID: ${make.Make_ID}. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error(`Failed to process Make_ID: ${make.Make_ID} after all retries.`);
        return null;
      }
      await sleep(delay);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const xmlParserService = app.get(XmlParserService);
  const dataBaseService = app.get(DataBaseService);

  console.log('Fetching and parsing XML data...');
  const allMakesXml = await xmlParserService.getAllMakes();
  console.log(allMakesXml.length);
  
  console.log('Transforming data...');
  const batchSize = 150;
  const concurrencyLimit = 40;

  for (let i = 0; i < allMakesXml.length; i += batchSize) {
    const batch = allMakesXml.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(allMakesXml.length / batchSize)}`);

    const batchResults = [];
    for (let j = 0; j < batch.length; j += concurrencyLimit) {
      const concurrentBatch = batch.slice(j, j + concurrencyLimit);
      const concurrentPromises = concurrentBatch.map(make => processMake(make, xmlParserService));
      const results = await Promise.all(concurrentPromises);
      batchResults.push(...results.filter(Boolean));
      await sleep(2000);
    }

    if (batchResults.length > 0) {
      console.log(`Saving batch of ${batchResults.length} items...`);
      await dataBaseService.saveManyVehicles(batchResults);
    }

    console.log(`Processed ${i + batchSize} out of ${allMakesXml.length} makes.`);
    await sleep(5000);
  }

  console.log('Data import completed');
  await app.close();
}

bootstrap();
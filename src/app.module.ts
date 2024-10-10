import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XmlParserService } from './xml-parser/xml-parser.service';
import { XmlParserModule } from './xml-parser/xml-parser.module';
import { DataBaseService } from './data-base/data-base.service';
import { DataBaseModule } from './data-base/data-base.module';
import { DataTransformerService } from './data-transformer/data-transformer.service';
import { DataTransformerModule } from './data-transformer/data-transformer.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    XmlParserModule,
    DataBaseModule,
    DataTransformerModule,
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    XmlParserService,
    DataBaseService,
    DataTransformerService,
  ],
})
export class AppModule {}

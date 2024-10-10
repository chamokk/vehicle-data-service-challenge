import { Module } from '@nestjs/common';
import { DataTransformerService } from './data-transformer.service';
import { XmlParserModule } from '../xml-parser/xml-parser.module';
import { DataBaseModule } from '../data-base/data-base.module';

@Module({
  imports: [XmlParserModule, DataBaseModule],
  providers: [DataTransformerService],
  exports: [DataTransformerService],
})
export class DataTransformerModule {}
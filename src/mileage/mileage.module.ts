import { Module } from '@nestjs/common';
import { MileageService } from './mileage.service';
import { MileageController } from './mileage.controller';
import { MileageSchema } from './schemas/mileage.schema';
import { GasIDSchema } from './schemas/gasid.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Mileage', schema: MileageSchema }]),
    MongooseModule.forFeature([{ name: 'GasID', schema: GasIDSchema }]),
  ],
  controllers: [MileageController],
  providers: [MileageService],
})
export class MileageModule {}

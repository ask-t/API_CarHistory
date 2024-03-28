import { Module } from '@nestjs/common';
import { MileageService } from './mileage.service';
import { MileageController } from './mileage.controller';
import { MileageSchema } from './schemas/mileage.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Mileage', schema: MileageSchema }]),
  ],
  controllers: [MileageController],
  providers: [MileageService],
})
export class MileageModule {}

import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetMileageDto } from './dto/get-mileage.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { CreateMileageDto } from './dto/create-mileage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mileage } from './schemas/mileage.schema';

@Injectable()
export class MileageService {
  constructor(
    @InjectModel(Mileage.name) private mileageModel: Model<Mileage>,
  ) {}
  async checkIN(): Promise<Mileage> {
    const previous = this.getPrevious();
    const firstMilage = new this.mileageModel({
      from: (await previous).to,
      total: (await previous).total,
      mile: -99999,
      startDate: new Date(),
      ...this.mileageModel,
    });
    return firstMilage.save();
  }

  async checkOUT(mile: UpdateMileageDto): Promise<Mileage> {
    const info = await this.mileageModel
      .findOne()
      .sort({ startDate: -1 })
      .exec();
    console.log(info);
    info.to = mile.to;
    info.miles = info.to - info.from;
    info.endDate = new Date();
    info.gas = mile.gas;
    info.total = info.total + info.miles;
    return info.save();
  }

  async getPrevious(): Promise<GetMileageDto> {
    const info = await this.mileageModel
      .findOne()
      .sort({ startDate: -1 })
      .exec();
    console.log(info);
    return info;
  }

  async findAll(): Promise<Mileage[]> {
    return this.mileageModel.find().exec();
  }

  async findOne(id: string): Promise<Mileage> {
    return this.mileageModel.findById(id).exec();
  }
  async reset(body: CreateMileageDto): Promise<Mileage> {
    const firstMilage = new this.mileageModel({
      from: body.from,
      to: body.to,
      gas: body.gas,
      total: 0,
      mile: 0,
      startDate: new Date(),
      endDate: new Date(),
    });
    return firstMilage.save();
  }

  async deleteMileageById(id: string): Promise<void> {
    console.log(`ID is ${id}`);
    const result = await this.mileageModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Mileage with ID "${id}" not found.`);
    }
  }
}

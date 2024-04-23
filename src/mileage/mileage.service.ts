import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetMileageDto } from './dto/get-mileage.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { CreateMileageDto } from './dto/create-mileage.dto';
import { GetGasDto } from './dto/get-gas.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mileage } from './schemas/mileage.schema';
import { GasID } from './schemas/gasid.schema';
@Injectable()
export class MileageService {
  constructor(
    @InjectModel(Mileage.name) private mileageModel: Model<Mileage>,
    @InjectModel(GasID.name) private gasIDModel: Model<GasID>,
  ) {}
  async checkIN(): Promise<Mileage> {
    const previous = this.getPrevious();
    const gID = await this.getGasID();
    const total = await this.gasIDModel.findById(gID).exec();
    const firstMilage = new this.mileageModel({
      from: (await previous).to,
      total: total.totalMile,
      mile: -99999,
      startDate: new Date(),
      gasID: gID,
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
    info.user = mile.user;
    info.description = mile.description;
    const gIDModel = await this.gasIDModel.findById(info.gasID).exec();
    gIDModel.totalMile = gIDModel.totalMile + info.miles;
    console.log(info._id.toString());
    gIDModel.IDs.push(info._id.toString());
    if (info.gas) {
      this.finishGasID(info.gasID.toString(), mile.totalCost);
      this.setGasID();
    }
    gIDModel.save();
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

  async getGasID(): Promise<string> {
    const model = await this.gasIDModel.findOne({ finish: false }).exec();
    if (!model) {
      this.setGasID();
      return this.getGasID();
    }
    return model._id.toString();
  }

  async getGasIDAll(): Promise<GasID[]> {
    return this.gasIDModel.find().exec();
  }

  async getGasIDinfoAll(): Promise<GetGasDto[]> {
    const models = await this.gasIDModel.find().exec();
    const result: GetGasDto[] = [];
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      let end: Date = model.endDate;
      if (model.finish) end = model.endDate;
      result.push({
        gasID: model._id.toString(),
        totalMile: model.totalMile,
        totalCost: model.totalCost,
        startDate: model.startDate,
        endDate: end,
        IDs: model.IDs,
        finish: model.finish,
      });
    }
    return result;
  }

  async getGasIDinfoSpec(gasid: string): Promise<Mileage[]> {
    const ids = await this.gasIDModel.findById(gasid).exec();
    const info: Mileage[] = [];
    for (let i = 0; i < ids.IDs.length; i++) {
      const model = await this.mileageModel.findById(ids.IDs[i]).exec();
      info.push(model);
    }
    return info;
  }

  async setGasID(): Promise<GasID> {
    const gasID = new this.gasIDModel({
      totalMile: 0,
      totalCost: 0,
      startDate: new Date(),
      endDate: null,
      IDs: [],
      finish: false,
    });
    return gasID.save();
  }

  async finishGasID(id: string, totalCost: number): Promise<GasID> {
    const model = await this.gasIDModel.findById(id).exec();
    model.finish = true;
    model.endDate = new Date();
    model.totalCost = totalCost;
    for (let i = 0; i < model.IDs.length; i++) {
      const mileage = await this.mileageModel.findById(model.IDs[i]).exec();
      mileage.cost = (totalCost / model.totalMile) * mileage.miles;
      await mileage.save();
    }
    return model.save();
  }

  async getStatus(): Promise<boolean> {
    const info = await this.mileageModel
      .findOne()
      .sort({ startDate: -1 })
      .exec();
    const endDate: Date = info.endDate;
    if (endDate == null) return true;
    return false;
  }
}

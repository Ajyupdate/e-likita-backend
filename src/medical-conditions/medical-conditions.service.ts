import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition, ConditionDocument } from './schemas/condition.schema';

@Injectable()
export class MedicalConditionsService {
  constructor(@InjectModel(Condition.name) private readonly model: Model<ConditionDocument>) {}

  async findAll() {
    return this.model.find().lean();
  }

  async findOneByCode(code: string) {
    const doc = await this.model.findOne({ code }).lean();
    if (!doc) throw new NotFoundException('Condition not found');
    return doc;
  }
}

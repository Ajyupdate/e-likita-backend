import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Symptom, SymptomDocument } from './schemas/symptom.schema';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';

@Injectable()
export class SymptomsService {
  constructor(@InjectModel(Symptom.name) private readonly model: Model<SymptomDocument>) {}

  async create(dto: CreateSymptomDto) {
    const doc = new this.model({
      ...dto,
      consultationId: new Types.ObjectId(dto.consultationId),
    });
    return doc.save();
  }

  async findByConsultation(consultationId: string) {
    return this.model.find({ consultationId: new Types.ObjectId(consultationId) }).lean();
  }

  async update(id: string, dto: UpdateSymptomDto) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException('Symptom not found');
    return doc;
  }

  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Symptom not found');
  }
}

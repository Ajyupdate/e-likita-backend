import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>) {}

  async create(dto: CreatePatientDto) {
    const doc = new this.patientModel({
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
    return doc.save();
  }

  async findAll() {
    return this.patientModel.find().lean();
  }

  async findOne(id: string) {
    const doc = await this.patientModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Patient not found');
    return doc;
  }

  async update(id: string, dto: UpdatePatientDto) {
    const doc = await this.patientModel
      .findByIdAndUpdate(
        id,
        { ...dto, dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined },
        { new: true },
      )
      .exec();
    if (!doc) throw new NotFoundException('Patient not found');
    return doc;
  }

  async remove(id: string) {
    const res = await this.patientModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Patient not found');
  }
}

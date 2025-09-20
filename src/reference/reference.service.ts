import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalHistoryOption, MedicalHistoryOptionDocument } from './schemas/medical-history-option.schema';
import { SymptomOption, SymptomOptionDocument } from './schemas/symptom-option.schema'
import { FollowupQuestion, FollowupQuestionDocument } from './schemas/followup-question.schema';

@Injectable()
export class ReferenceService implements OnModuleInit {
  constructor(
    @InjectModel(MedicalHistoryOption.name) private readonly mhModel: Model<MedicalHistoryOptionDocument>,
    @InjectModel(SymptomOption.name) private readonly symptomModel: Model<SymptomOptionDocument>,
    @InjectModel(FollowupQuestion.name) private readonly fqModel: Model<FollowupQuestionDocument>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const mhCount = await this.mhModel.estimatedDocumentCount();
    if (mhCount === 0) {
      await this.mhModel.insertMany([
        { key: 'diabetes', label: 'Diabetes' },
        { key: 'hypertension', label: 'High Blood Pressure' },
        { key: 'heart-disease', label: 'Heart Disease' },
        { key: 'asthma', label: 'Asthma' },
      ]);
    }

    const symptomCount = await this.symptomModel.estimatedDocumentCount();
    if (symptomCount === 0) {
      await this.symptomModel.insertMany([
        { key: 'fever', label: 'Fever / High Temperature' },
        { key: 'chest-pain', label: 'Chest Pain' },
        { key: 'dyspnea', label: 'Difficulty Breathing' },
        { key: 'headache', label: 'Headache' },
      ]);
    }

    const fqCount = await this.fqModel.estimatedDocumentCount();
    if (fqCount === 0) {
      await this.fqModel.insertMany([
        { symptomKey: 'fever', question: 'What is your current temperature?' },
        { symptomKey: 'fever', question: 'Are you experiencing chills?' },
        { symptomKey: 'dyspnea', question: 'Did the breathing difficulty start suddenly?' },
        { symptomKey: 'dyspnea', question: 'Do you have chest tightness or wheezing?' },
      ]);
    }
  }

  getMedicalHistory() {
    return this.mhModel.find().lean();
  }

  getSymptoms() {
    return this.symptomModel.find().lean();
  }

  getFollowups(symptomKeys: string[]) {
    return this.fqModel.find({ symptomKey: { $in: symptomKeys } }).lean();
  }
}


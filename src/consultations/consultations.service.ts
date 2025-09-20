import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { SubmitConsultationDto, ConsultationResponseDto } from './dto/submit-consultation.dto';
import { RiskService } from '../risk/risk.service';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name) private readonly model: Model<ConsultationDocument>,
    private readonly riskService: RiskService,
  ) {}

  async create(dto: CreateConsultationDto) {
    const number = `CONS-${Date.now().toString(36).toUpperCase()}`;
    const doc = new this.model({
      patientId: new Types.ObjectId(dto.patientId),
      consultationNumber: number,
      status: dto.status || 'in-progress',
      steps: {},
    });
    return doc.save();
  }

  async findAll() {
    return this.model.find().lean();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Consultation not found');
    return doc;
  }

  async findByPatient(patientId: string) {
    return this.model.find({ patientId: new Types.ObjectId(patientId) }).lean();
  }

  async update(id: string, dto: UpdateConsultationDto) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException('Consultation not found');
    return doc;
  }

  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Consultation not found');
  }

  async submitConsultation(dto: SubmitConsultationDto, user?: any): Promise<ConsultationResponseDto> {
    // Generate consultation number
    const consultationNumber = `CONS-${Date.now().toString(36).toUpperCase()}`;
    
    // Calculate risk assessment
    const durationHours = this.parseDurationToHours(dto.symptomDetails.duration || '');
    const hasRedFlags = this.checkRedFlags(dto.selectedSymptoms, dto.followupAnswers);
    
    const riskAssessment = this.riskService.assess({
      severity: dto.symptomDetails.severity || 5,
      durationHours,
      redFlags: hasRedFlags,
    });

    // Generate recommendations based on symptoms and risk
    const recommendations = this.generateRecommendations(
      dto.selectedSymptoms,
      dto.patientInfo.medicalHistory,
      riskAssessment.level,
      dto.followupAnswers
    );

    // Generate next steps
    const nextSteps = this.generateNextSteps(riskAssessment.level, dto.selectedSymptoms);

    // Determine urgency
    const urgency = this.determineUrgency(riskAssessment.level, dto.selectedSymptoms);

    // Save consultation to database
    const consultation = new this.model({
      consultationNumber,
      patientId: user ? new Types.ObjectId(user.userId) : null, // Link to user if logged in
      status: 'completed',
      steps: {
        patientInfo: dto.patientInfo,
        symptoms: dto.selectedSymptoms.map(symptom => ({
          name: symptom,
          ...dto.symptomDetails
        })),
        followUpAnswers: dto.followupAnswers,
        riskAssessment: {
          ...riskAssessment,
          score: this.calculateRiskScore(riskAssessment.level)
        },
        recommendations
      },
      completedAt: new Date(),
    });

    const savedConsultation = await consultation.save();

    return {
      consultationId: savedConsultation._id.toString(),
      riskAssessment: {
        ...riskAssessment,
        score: this.calculateRiskScore(riskAssessment.level)
      },
      recommendations,
      nextSteps,
      urgency,
    };
  }

  private parseDurationToHours(duration: string): number {
    if (duration.includes('hour')) return 12;
    if (duration.includes('1-3 days')) return 48;
    if (duration.includes('4-7 days')) return 120;
    if (duration.includes('1-2 weeks')) return 240;
    if (duration.includes('More than 2 weeks')) return 360;
    return 24;
  }

  private checkRedFlags(symptoms: string[], followupAnswers: Record<string, string>): boolean {
    const redFlagSymptoms = ['chest-pain', 'dyspnea'];
    const hasRedFlagSymptom = symptoms.some(s => redFlagSymptoms.includes(s));
    
    // Check follow-up answers for red flags
    const concerningAnswers = Object.values(followupAnswers).some(answer => 
      answer.toLowerCase().includes('sudden') || answer.toLowerCase().includes('severe')
    );
    
    return hasRedFlagSymptom || concerningAnswers;
  }

  private generateRecommendations(
    symptoms: string[], 
    medicalHistory: string[], 
    riskLevel: string,
    followupAnswers: Record<string, string>
  ): string[] {
    const recommendations: string[] = [];
    
    // General recommendations based on risk level
    if (riskLevel === 'Emergency') {
      recommendations.push('Seek immediate emergency medical attention');
      recommendations.push('Call emergency services (911) if symptoms worsen');
      recommendations.push('Do not drive yourself to the hospital');
    } else if (riskLevel === 'High') {
      recommendations.push('Schedule an urgent appointment with your healthcare provider within 24 hours');
      recommendations.push('Monitor symptoms closely and seek immediate care if they worsen');
      recommendations.push('Consider visiting an urgent care center if primary care is unavailable');
    } else if (riskLevel === 'Medium') {
      recommendations.push('Schedule an appointment with your healthcare provider within 2-3 days');
      recommendations.push('Monitor symptoms and keep a symptom diary');
      recommendations.push('Take over-the-counter pain relievers as directed if needed');
    } else {
      recommendations.push('Monitor symptoms and contact your healthcare provider if they persist or worsen');
      recommendations.push('Get plenty of rest and stay hydrated');
      recommendations.push('Consider home remedies appropriate for your symptoms');
    }

    // Symptom-specific recommendations
    if (symptoms.includes('fever')) {
      recommendations.push('Take your temperature regularly and record it');
      recommendations.push('Stay hydrated with plenty of fluids');
      recommendations.push('Rest in a cool, comfortable environment');
    }

    if (symptoms.includes('chest-pain')) {
      recommendations.push('Avoid strenuous activities');
      recommendations.push('Sit upright and try to remain calm');
      recommendations.push('Note any triggers or patterns to the pain');
    }

    if (symptoms.includes('dyspnea')) {
      recommendations.push('Sit upright or in a comfortable position');
      recommendations.push('Practice slow, deep breathing exercises');
      recommendations.push('Avoid allergens and irritants if known');
    }

    if (symptoms.includes('headache')) {
      recommendations.push('Apply a cold or warm compress to your head or neck');
      recommendations.push('Rest in a quiet, dark room');
      recommendations.push('Stay hydrated and avoid known triggers');
    }

    // Medical history considerations
    if (medicalHistory.includes('Diabetes')) {
      recommendations.push('Monitor blood sugar levels more frequently');
      recommendations.push('Continue taking diabetes medications as prescribed');
    }

    if (medicalHistory.includes('High Blood Pressure')) {
      recommendations.push('Monitor blood pressure regularly');
      recommendations.push('Continue taking blood pressure medications as prescribed');
    }

    return recommendations;
  }

  private generateNextSteps(riskLevel: string, symptoms: string[]): string[] {
    const nextSteps: string[] = [];
    
    if (riskLevel === 'Emergency') {
      nextSteps.push('Go to the nearest emergency department immediately');
      nextSteps.push('Bring a list of current medications and medical history');
      nextSteps.push('Have someone drive you or call an ambulance');
    } else if (riskLevel === 'High') {
      nextSteps.push('Contact your primary care physician today');
      nextSteps.push('If unavailable, visit an urgent care center');
      nextSteps.push('Prepare a list of questions for your healthcare provider');
    } else if (riskLevel === 'Medium') {
      nextSteps.push('Schedule a routine appointment with your healthcare provider');
      nextSteps.push('Keep track of symptom changes');
      nextSteps.push('Continue monitoring and follow up as needed');
    } else {
      nextSteps.push('Continue self-monitoring');
      nextSteps.push('Contact healthcare provider if symptoms persist beyond expected timeframe');
      nextSteps.push('Maintain healthy lifestyle habits');
    }

    return nextSteps;
  }

  private determineUrgency(riskLevel: string, symptoms: string[]): {
    requiresImmediateAttention: boolean;
    timeframe?: string;
    instructions?: string;
  } {
    if (riskLevel === 'Emergency') {
      return {
        requiresImmediateAttention: true,
        timeframe: 'Immediately',
        instructions: 'Seek emergency medical care right away. Call 911 or go to the nearest emergency department.'
      };
    } else if (riskLevel === 'High') {
      return {
        requiresImmediateAttention: true,
        timeframe: 'Within 24 hours',
        instructions: 'Schedule an urgent appointment with your healthcare provider or visit urgent care.'
      };
    } else if (riskLevel === 'Medium') {
      return {
        requiresImmediateAttention: false,
        timeframe: 'Within 2-3 days',
        instructions: 'Schedule a routine appointment with your healthcare provider.'
      };
    } else {
      return {
        requiresImmediateAttention: false,
        timeframe: 'Monitor symptoms',
        instructions: 'Continue self-monitoring and contact healthcare provider if symptoms worsen or persist.'
      };
    }
  }

  private calculateRiskScore(level: string): number {
    switch (level) {
      case 'Emergency': return 9;
      case 'High': return 7;
      case 'Medium': return 5;
      case 'Low': return 2;
      default: return 1;
    }
  }
}

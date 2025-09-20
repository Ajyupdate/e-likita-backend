import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReferenceService } from './reference.service';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly ref: ReferenceService) {}

  @Get('medical-history')
  medicalHistory() {
    return this.ref.getMedicalHistory();
  }

  @Get('symptoms')
  symptoms() {
    return this.ref.getSymptoms();
  }

  @Post('followups')
  followups(@Body() body: { symptomKeys: string[] }) {
    return this.ref.getFollowups(body.symptomKeys || []);
  }
}


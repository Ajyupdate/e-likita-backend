import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RiskService } from './risk.service';

@ApiTags('risk-assessment')
@Controller('risk-assessment')
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Post()
  assess(@Body() body: { severity?: number; durationHours?: number; redFlags?: boolean }) {
    return this.risk.assess(body);
  }
}


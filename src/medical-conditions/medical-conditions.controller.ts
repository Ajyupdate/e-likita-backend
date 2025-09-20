import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MedicalConditionsService } from './medical-conditions.service';

@ApiTags('medical-conditions')
@Controller('medical-conditions')
export class MedicalConditionsController {
  constructor(private readonly service: MedicalConditionsService) {}

  @Get()
  all() {
    return this.service.findAll();
  }

  @Get(':code')
  byCode(@Param('code') code: string) {
    return this.service.findOneByCode(code);
  }
}

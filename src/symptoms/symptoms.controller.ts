import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';

@ApiTags('symptoms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly service: SymptomsService) {}

  @Post()
  create(@Body() dto: CreateSymptomDto) {
    return this.service.create(dto);
  }

  @Get('consultation/:consultationId')
  byConsultation(@Param('consultationId') consultationId: string) {
    return this.service.findByConsultation(consultationId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSymptomDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

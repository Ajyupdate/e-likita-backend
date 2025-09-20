import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { SubmitConsultationDto } from './dto/submit-consultation.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { OptionalUser } from '../auth/optional-auth.decorator';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly service: ConsultationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateConsultationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  byPatient(@Param('patientId') patientId: string) {
    return this.service.findByPatient(patientId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateConsultationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('submit')
  @UseGuards(OptionalJwtAuthGuard)
  submitConsultation(@Body() dto: SubmitConsultationDto, @OptionalUser() user: any) {
    return this.service.submitConsultation(dto, user);
  }
}

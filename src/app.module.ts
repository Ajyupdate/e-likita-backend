import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { MedicalConditionsModule } from './medical-conditions/medical-conditions.module';
import { RiskModule } from './risk/risk.module';
import { AuthModule } from './auth/auth.module';
import { ReferenceModule } from './reference/reference.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { ttl: 60_000, limit: 100 },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/e-likita',
        serverSelectionTimeoutMS: 5000,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PatientsModule,
    ConsultationsModule,
    SymptomsModule,
    MedicalConditionsModule,
    RiskModule,
    ReferenceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

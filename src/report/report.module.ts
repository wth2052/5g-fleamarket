import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesEntity } from '../global/entities/notices.entity';
import { ReportsEntity } from '../global/entities/reports.entity';
import { UserEntity } from '../global/entities/users.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ReportsEntity, NoticesEntity]),
  ],
  controllers: [ReportController],
  providers: [ReportService, JwtService]
})
export class ReportModule {}

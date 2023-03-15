import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsEntity } from '../global/entities/reports.entity';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
    constructor(
       
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ReportsEntity)
        private reportRepository: Repository<ReportsEntity>,
      ) {}

async createReport(userId: number, reported: string, title: string, description: string){
    await this.reportRepository.insert({
        reporterId: userId,
        reported : reported,
        title: title,
        description: description
      });

    return {message : '신고가 접수되었습니다.'}
}

}

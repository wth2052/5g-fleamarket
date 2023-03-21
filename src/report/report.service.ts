import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsEntity } from '../global/entities/reports.entity';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import { NoticesEntity } from '../global/entities/notices.entity';

@Injectable()
export class ReportService {
    constructor(
       
        @InjectRepository(NoticesEntity)
        private noticeRepository: Repository<NoticesEntity>,
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

//공지사항 모두 조회

async getNotices(limit: number, offset: number) {
  const notices = await this.noticeRepository.find({
    take: limit,
    skip: offset,
  });
  if (notices.length === 0) {
    throw new NotFoundException('공지사항이 없습니다.');
  } else {
    return notices;
  }
}
async getTotalNotice() {
  return this.noticeRepository.count();
}

}

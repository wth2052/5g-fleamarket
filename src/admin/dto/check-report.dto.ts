import { IsNumber } from 'class-validator';

export class CheckReportDto {
  @IsNumber()
  readonly status: number;
}
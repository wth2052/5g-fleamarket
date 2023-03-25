import { IsNumber, IsString } from 'class-validator';

export class CheckReportDto {
  @IsNumber()
  readonly status: number;

  @IsString()
  readonly reported: string
}
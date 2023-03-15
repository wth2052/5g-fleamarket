import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {

  @IsString()
  readonly reported: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export interface JwtDecodeDto {
  [key: string]: string | number;
  id: number;
  email: string;
  nickname: string;
  address: string;
  iat: number;
  exp: number;
}

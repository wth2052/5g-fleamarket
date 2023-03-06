import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: '올바른 이메일의 형식이 아닙니다.',
    },
  )
  @IsNotEmpty({
    message: '이메일은 필수 입력값입니다.',
  })
  readonly email: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 0,
    },
    {
      message: '비밀번호는 최소 6자리의 문자열로 구성되어야 합니다.',
    },
  )
  readonly password: string;

  @IsNumber()
  readonly phone: string;

  @IsString()
  readonly address: string;
}

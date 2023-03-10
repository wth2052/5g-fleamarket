import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
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
    message: '이메일을 입력해주세요.',
  })
  readonly email: string;

  @IsString()
  readonly nickname: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영문과 숫자만 사용할 수 있습니다.',
  })
  readonly password: string;

  @IsNumber()
  readonly phone: string;

  @IsNumber()
  readonly ban: number;

  @IsString()
  readonly address: string;
}
export class AuthUserDto {
  @IsEmail(
    {},
    {
      message: '올바른 이메일의 형식이 아닙니다.',
    },
  )
  @IsNotEmpty({
    message: '이메일을 입력해주세요.',
  })
  readonly email: string;

  @IsString()
  readonly nickname: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영문과 숫자만 사용할 수 있습니다.',
  })
  readonly password: string;
  readonly phone: string;
  readonly address: string;
}
export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
export class GoogleLoginUserDto extends PickType(CreateUserDto, [
  'email',
  'nickname',
]) {}
export class TokenGenerateDto extends PickType(CreateUserDto, [
  'email',
  'nickname',
]) {
  @IsNumber()
  readonly id: number;
}

export class EmailVerifyUserDto extends PickType(CreateUserDto, ['email']) {}
export class VerifyEmailNumberDto extends EmailVerifyUserDto {
  @IsNumber()
  readonly verifyNumber: number;
}

export class OAuthAddInformationDto extends PickType(CreateUserDto, [
  'nickname',
  'phone',
  'address',
]) {}

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
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({
    message: '이메일을 입력해주세요.',
  })
  readonly email: string;
  @Type(() => String)
  @IsString()
  readonly nickname: string;
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '비밀번호는 한개의 영문, 한개의 숫자, 한개의 특수문자를 포함한 8자 이상이 되어야 합니다.',
  })
  readonly password: string;
  @Type(() => String)
  readonly phone: string;

  @IsNumber()
  readonly ban: number;

  @IsString()
  readonly address: string;
}
export class AuthUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'nickname',
  'address',
  'phone',
]) {
  // @IsEmail(
  //   {},
  //   {
  //     message: '올바른 이메일의 형식이 아닙니다.',
  //   },
  // )
  // @IsNotEmpty({
  //   message: '이메일을 입력해주세요.',
  // })
  // readonly email: string;
  //
  // @IsString()
  // readonly nickname: string;
  // @IsNotEmpty()
  // @IsString()
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
  //   message:
  //     '비밀번호는 최소 8자 이상, 한개 이상의 문자와 숫자로 이루어져야 합니다.',
  // })
  // readonly password: string;
  // readonly phone: string;
  // readonly address: string;
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

export class UpdateUserDto extends PickType(CreateUserDto, [
  'email',
  'nickname',
  'phone',
  'address',
]) {
  @IsNumber()
  readonly id: number;
}

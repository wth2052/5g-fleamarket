import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class PostLoginResponse {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class GetRefreshResponse {
  @ApiProperty()
  readonly accessToken: string;
}

export interface JwtDecodeDto {
  [key: string]: string | number;
  id: number;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

export class SocialLoginBodyDTO {
  @IsNotEmpty({
    message: 'code는 필수로 입력해야 합니다.',
  })
  @IsString({
    message: 'code 문자열로 입력되어야 합니다.',
  })
  code: string;
  @IsOptional()
  @IsNotEmpty({
    message: 'state는 비어있으면 안 됩니다.',
  })
  @IsString({
    message: 'state는 문자열로 입력되어야 합니다.',
  })
  state?: string;
}
export class ProviderDTO {
  @IsIn(['kakao'], {
    message: '소셜 로그인은 kakao만 지원합니다.',
  })
  provider: 'kakao';
}

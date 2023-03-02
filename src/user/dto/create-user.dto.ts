import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly password: string;

  @IsNumber()
  readonly phone: string;

  @IsString()
  readonly address: string;
}

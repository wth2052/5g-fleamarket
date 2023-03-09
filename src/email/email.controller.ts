// //TODO: 이메일 인증 시 인증번호를 발송 or 이메일 인증시 링크를 통해 들어온 사용자를 가입 시키는 로직
// 이쪽에서 처리해야할 로직? 이메일 인증 라우터를 생성후
// 이메일 인증 처리후 된 값 반환
import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import {
  EmailVerifyUserDto,
  VerifyEmailNumberDto,
} from '../user/dto/create-user.dto';

@Controller('email-verify')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendEmail(@Body() user: EmailVerifyUserDto) {
    await this.emailService.sendEmail(user);
    return `입력하신 메일주소로 인증번호를 발송했습니다 ${user.email}`;
  }
  @Post('verify-number')
  async verifyEmailNumber(@Body() user: VerifyEmailNumberDto): Promise<object> {
    await this.emailService.verifyEmailNumber(user);
    return {
      message: '이메일 인증에 성공하였습니다.',
    };
  }
}

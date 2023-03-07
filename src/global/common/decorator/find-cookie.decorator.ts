import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtDecodeDto } from '../../../user/dto/jwt-decode-dto';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext): JwtDecodeDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
    // return data ? request.cookies?.[data] : request.cookies;
  },
);

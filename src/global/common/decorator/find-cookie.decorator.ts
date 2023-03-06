import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtDecodeDto } from 'src/orders/dto/jwtdecode-order.dto';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext): JwtDecodeDto => {
    const request = ctx.switchToHttp().getRequest();
    console.log('11111', request.user);
    return request.user;
    // return data ? request.cookies?.[data] : request.cookies;
  },
);

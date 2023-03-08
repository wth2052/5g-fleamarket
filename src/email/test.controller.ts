// //TODO: 이메일 인증 시 인증번호를 발송 or 이메일 인증시 링크를 통해 들어온 사용자를 가입 시키는 로직
// 이쪽에서 처리해야할 로직? 이메일 인증 라우터를 생성후
// 이메일 인증 처리후 된 값 반환
import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('test')
export class TestController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  @Get('get')
  async get(): Promise<void> {
    const value = await this.cacheManager.get('b');
    console.log('✅get : ', value);
  }

  @Get('keys')
  async keys(): Promise<void> {
    const value = await this.cacheManager.keys();
    console.log('✅get : ', value);
  }

  @Get('set')
  async set(): Promise<void> {
    await this.cacheManager.set('b', 'value1', { ttl: 0 });
  }
}

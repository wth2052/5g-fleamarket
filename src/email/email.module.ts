import { CacheModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { EmailController } from './email.controller';

export const cacheModule = CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: '127.0.0.1',
    port: '6379',
  }),
});

@Module({
  imports: [cacheModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [cacheModule],
})
export class EmailModule {}

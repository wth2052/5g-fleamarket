import { CacheModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { EmailController } from './email.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '../global/config/redis.config';
@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
  ],

  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}

import { CacheModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { EmailController } from './email.controller';
import { cacheModule } from 'src/user/user.module';



@Module({
  imports: [cacheModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [EmailService],
  controllers: [EmailController],

})
export class EmailModule {}

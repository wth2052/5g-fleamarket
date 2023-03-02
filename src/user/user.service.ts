import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(
    nickname: string,
    email: string,
    password: string,
    phone: string,
    address: string,
  ) {
    const newUser = await this.usersRepository.findOne({ where: { email } });
    if (newUser) {
      throw new UnauthorizedException('이미 존재하는 유저입니다.');
      return;
    } else {
      const hashedPwd = await bcrypt.hash(password, 12);
      await this.usersRepository.save({
        nickname,
        email,
        password: hashedPwd,
        phone,
        address,
      });
    }
  }
}

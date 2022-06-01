import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // email 체크
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('이메일 사용중');
    }

    // hash password
    // salt 생성
    const salt = randomBytes(8).toString('hex');
    // hash > salt + password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // salt와 결과 합침
    // create user
    const user = await this.usersService.create(
      email,
      salt + '.' + hash.toString('hex'),
    );

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}

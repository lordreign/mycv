import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    return await this.repo.findOne(id);
  }

  async find(email: string): Promise<User[]> {
    // return this.repo.find({
    //   relations: ['reports'],
    //   where: {
    //     email,
    //   },
    // });

    // 두가지 케이스로 가져올 수 있다..
    const users = await this.repo.find({
      where: {
        email,
      },
    });
    if (users.length > 0) {
      console.log(await users[0].reports);
    }
    return users;
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    // TODO after update 동작확인
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // TODO after remove 동작확인
    return this.repo.remove(user);
  }
}

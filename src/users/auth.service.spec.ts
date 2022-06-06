import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// test 실행 > yarn test:watch > p > 파일명
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // dependancy 설정
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('creating auth service instance', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('singup시 이메일이 사용중일때 에러발생', async () => {
    // 여기에서만 적용...
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    // try {
    // await service.signup('asdf@asdf.com', 'asdf');
    // } catch (error) {
    //   console.log(error);
    //   done();
    // }
    await service.signup('asdf@asdf.com', 'mypassword');
    // async/await과 promise/done을 함께 사용할 수 없다.
    // try catch로 예전에는 test를 할수 있었지만 지금은 바뀌었다
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('사용하지 않는 email로 로그인시 에러 발생', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('패스워드 잘못입력할때 에러 발생', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'asdf@asdf.com', password: '1234' } as User,
    //   ]);

    await service.signup('asdf@asdf.com', 'mypassword');
    await expect(service.signin('asdf@asdf.com', '1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('password가 맞을때 user 반환', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'asdf@asdf.com',
    //       password:
    //         '0875075c566ffb6f.0ba60778ae5dbdb430aa0e17e205753d18d9d65c1433d442e0f5f1bb350e1d2d',
    //     } as User,
    //   ]);
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});

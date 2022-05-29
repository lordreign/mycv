import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto) // 전체 항목에 적용
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto) // 단일 항목에만 적용
  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = this.usersService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException('not found user');
    }
    return user;
    // return { id: 1, email: 't@t.com', password: '123' }; // 이런식으로 보내도 serialize 적용됨
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }
}

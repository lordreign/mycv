import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';

// typescript에게 currentUser가 있을수 있다고 정의해주어야지 req.currentUser=user 구문을 사용할 수 있음.
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

// 사용자 정보 받아오기 middleware 공통 부분
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}

import { Expose, Exclude } from 'class-transformer';

// 밖으로 보여주고싶은것만 나열하기
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

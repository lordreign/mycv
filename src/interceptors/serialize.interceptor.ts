import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 요청이 들어오기전
    console.log('running before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // response가 보내지기전
        console.log('running before response is sent out', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // expose만 노출 시킴
        });
      }),
    );
  }
}

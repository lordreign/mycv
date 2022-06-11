import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimatetDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value, 10)) // query로는 string으로 인식하기때문에 에러발생하기 때문에 integer로 변경처리
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseFloat(value)) // query로는 string으로 인식하기때문에 에러발생하기 때문에 integer로 변경처리
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value)) // query로는 string으로 인식하기때문에 에러발생하기 때문에 integer로 변경처리
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseInt(value, 10)) // query로는 string으로 인식하기때문에 에러발생하기 때문에 integer로 변경처리
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}

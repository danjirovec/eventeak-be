import { ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType('OrderGraph')
export class OrderGraphDto {
  @IsNotEmpty()
  @IsString()
  @FilterableField()
  date!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  total!: number;
}

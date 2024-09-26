import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@ObjectType('BusinessMetrics')
export class BusinessMetricsDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => [Number])
  customers!: number[];

  @IsNotEmpty()
  @IsArray()
  @Field(() => [Number])
  memberships!: number[];

  @IsNotEmpty()
  @IsArray()
  @Field(() => [Number])
  events!: number[];
}

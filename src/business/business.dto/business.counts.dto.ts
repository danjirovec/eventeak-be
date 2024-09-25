import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@ObjectType('CountsBusiness')
export class CountsBusinessDto {
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

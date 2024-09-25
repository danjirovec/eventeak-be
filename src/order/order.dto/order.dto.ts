import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('Order')
@FilterableRelation('user', () => UserDto)
@FilterableRelation('business', () => BusinessDto)
export class OrderDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  total!: number;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  userId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

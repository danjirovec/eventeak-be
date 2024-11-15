import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { PaymentType } from 'src/enum/enum';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('Order')
@FilterableRelation('user', () => UserDto, { nullable: true })
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

  @IsOptional()
  @IsString()
  @FilterableField({ nullable: true })
  paymentId?: string;

  @IsDefined()
  @IsEnum(PaymentType, { each: true })
  @FilterableField(() => PaymentType, {
    defaultValue: PaymentType.Ticket,
  })
  paymentType!: PaymentType;

  @IsNotEmpty()
  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsOptional()
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

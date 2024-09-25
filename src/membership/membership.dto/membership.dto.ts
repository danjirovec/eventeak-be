import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { MembershipTypeDto } from 'src/membership.type/membership.type.dto/membership.type.dto';
import { UserDto } from 'src/user/user.dto/user.dto';
import { getOneYearExpiryDate } from 'src/utils/membershipExpiryDate';

@ObjectType('Membership')
@FilterableRelation('user', () => UserDto)
@FilterableRelation('membershipType', () => MembershipTypeDto, {
  nullable: true,
})
@FilterableRelation('business', () => BusinessDto)
export class MembershipDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField({ defaultValue: 0 })
  points!: number;

  @IsNotEmpty()
  @IsDate()
  @FilterableField({ defaultValue: getOneYearExpiryDate() })
  expiryDate!: Date;

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

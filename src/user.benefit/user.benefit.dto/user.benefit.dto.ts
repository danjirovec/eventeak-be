import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableOffsetConnection,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { BenefitDto } from 'src/benefit/benefit.dto/benefit.dto';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('UserBenefit')
@FilterableRelation('user', () => UserDto)
@FilterableRelation('benefit', () => BenefitDto)
@FilterableRelation('business', () => BusinessDto)
export class UserBenefitDto {
  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  userId!: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  benefitId!: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId!: string;
}

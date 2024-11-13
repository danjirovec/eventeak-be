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
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';

@ObjectType('MembershipType')
@FilterableRelation('business', () => BusinessDto)
export class MembershipTypeDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField({ nullable: true })
  pointsPerTicket!: number;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField({ nullable: true })
  price!: number;

  @IsOptional()
  @IsString()
  @FilterableField({ nullable: true })
  description?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

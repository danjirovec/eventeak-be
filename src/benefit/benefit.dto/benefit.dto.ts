import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
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

@ObjectType('Benefit')
@FilterableRelation('business', () => BusinessDto)
export class BenefitDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  points!: number;

  @IsOptional()
  @IsDate()
  @FilterableField({ nullable: true })
  expiryDate?: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId!: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

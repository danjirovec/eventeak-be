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
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import JSON from 'graphql-type-json';

@ObjectType('Venue')
@FilterableRelation('business', () => BusinessDto)
export class VenueDto {
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
  @FilterableField()
  capacity!: number;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  city!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  street!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  buildingNumber!: string;

  @IsNotEmpty()
  @IsBoolean()
  @FilterableField()
  hasSeats!: boolean;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  data?: any;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

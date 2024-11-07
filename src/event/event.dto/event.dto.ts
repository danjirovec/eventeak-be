import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { TemplateDto } from 'src/template/template.dto/template.dto';
import JSON from 'graphql-type-json';

@ObjectType('Event')
@FilterableRelation('business', () => BusinessDto)
@FilterableRelation('template', () => TemplateDto)
export class EventDto {
  @IsNotEmpty()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  name!: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField()
  date!: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  templateId?: string;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  seatMap?: any;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

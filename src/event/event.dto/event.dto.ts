import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
  QueryOptions,
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
import { Category, Language } from 'src/enum/enum';
import { EventTemplateDto } from 'src/event.template/event.template.dto/event.template.dto';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';
import JSON from 'graphql-type-json';

@ObjectType('Event')
@QueryOptions({ filterDepth: 2 })
@FilterableRelation('venue', () => VenueDto)
@FilterableRelation('business', () => BusinessDto)
@FilterableRelation('eventTemplate', () => EventTemplateDto)
export class EventDto {
  @IsNotEmpty()
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
  length!: number;

  @IsDefined()
  @IsEnum(Category, { each: true })
  @FilterableField(() => Category)
  category!: Category;

  @IsDefined()
  @IsEnum(Language, { each: true })
  @FilterableField(() => Language)
  language!: Language;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @FilterableField(() => Language, { nullable: true })
  subtitles?: Language;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  posterUrl?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField()
  date!: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  eventTemplateId?: string;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  venueData?: any;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { Category, Language, TemplateType } from 'src/enum/enum';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';

@ObjectType('EventTemplate')
@FilterableRelation('venue', () => VenueDto)
@FilterableRelation('business', () => BusinessDto)
export class EventTemplateDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  name!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @FilterableField({ nullable: true })
  length?: number;

  @IsDefined()
  @IsEnum(TemplateType, { each: true })
  @FilterableField(() => TemplateType)
  type!: TemplateType;

  @IsDefined()
  @IsEnum(Category, { each: true })
  @FilterableField(() => Category)
  category!: Category;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @FilterableField(() => Language, { nullable: true })
  language?: Language;

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
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

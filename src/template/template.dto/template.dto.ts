import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
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
  IsUrl,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { Category, Language, Type } from 'src/enum/enum';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';

@ObjectType('Template')
@FilterableRelation('venue', () => VenueDto)
@FilterableRelation('business', () => BusinessDto)
export class TemplateDto {
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
  @FilterableField({ nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @FilterableField({ nullable: true })
  length?: number;

  @IsDefined()
  @IsEnum(Type, { each: true })
  @FilterableField(() => Type)
  type!: Type;

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

  @IsString()
  @FilterableField({ filterOnly: true })
  venueId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

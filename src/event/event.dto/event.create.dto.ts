import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsDefined,
  IsDateString,
  IsDate,
} from 'class-validator';
import { Category, Language } from 'src/enum/enum';
import JSON from 'graphql-type-json';

@InputType('CreateEvent')
export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  length!: number;

  @IsDefined()
  @IsEnum(Category, { each: true })
  @Field(() => Category)
  category!: Category;

  @IsDefined()
  @IsEnum(Language, { each: true })
  @Field(() => Language)
  language!: Language;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @Field(() => Language, { nullable: true })
  subtitles?: Language;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  posterUrl?: string;

  @IsNotEmpty()
  @IsDate()
  @Field()
  date!: Date;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  venueData?: any;

  @IsNotEmpty()
  @Field(() => ID)
  eventTemplateId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  venueId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;
}

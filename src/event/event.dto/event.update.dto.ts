import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Category, Language } from 'src/enum/enum';
import JSON from 'graphql-type-json';

@InputType('UpdateEvent')
export class UpdateEventDto {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  id!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date?: Date;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  length?: number;

  @IsOptional()
  @IsEnum(Category, { each: true })
  @Field(() => Category, { nullable: true })
  category?: Category;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @Field(() => Language, { nullable: true })
  language?: Language;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @Field(() => Language, { nullable: true })
  subtitles?: Language;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  posterUrl?: string;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  venueData?: any;
}

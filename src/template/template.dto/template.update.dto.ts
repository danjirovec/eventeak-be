import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Category, Language, Type } from 'src/enum/enum';
import { UpdatePriceCategoryDto } from 'src/price.category/price.category.dto/price.category.update.dto';

@InputType('UpdateTemplate')
export class UpdateTemplateDto {
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
  @IsNumber()
  @Field({ nullable: true })
  length?: number;

  @IsOptional()
  @IsEnum(Type, { each: true })
  @Field(() => Type, { nullable: true })
  type?: Type;

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
  @IsString()
  @Field(() => ID, { nullable: true })
  venueId?: string;

  @IsOptional()
  @Field(() => [UpdatePriceCategoryDto], { nullable: true })
  priceCategory?: UpdatePriceCategoryDto[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  discount?: string[];
}

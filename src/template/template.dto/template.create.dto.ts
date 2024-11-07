import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { Category, Language, Type } from 'src/enum/enum';
import { CreatePriceCategoryInputDto } from 'src/price.category/price.category.dto/price.category.create.dto';

@InputType('CreateTemplate')
export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description!: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  length!: number;

  @IsDefined()
  @IsEnum(Type, { each: true })
  @Field(() => Type)
  type!: Type;

  @IsDefined()
  @IsEnum(Category, { each: true })
  @Field(() => Category)
  category!: Category;

  @IsOptional()
  @IsEnum(Language, { each: true })
  @Field(() => Language, { nullable: true })
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
  @Field(() => ID)
  venueId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;

  @IsNotEmpty()
  @Field(() => [CreatePriceCategoryInputDto])
  priceCategory!: CreatePriceCategoryInputDto[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  discount?: string[];
}

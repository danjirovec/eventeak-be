import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Category, Language, TemplateType } from 'src/enum/enum';
import { UpdateEventPriceCategoryDto } from 'src/event.price.category/event.price.category.dto/event.price.category.update.dto';

@InputType('UpdateEventTemplate')
export class UpdateEventTemplateDto {
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
  @IsEnum(TemplateType, { each: true })
  @Field(() => TemplateType, { nullable: true })
  type?: TemplateType;

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
  @Field(() => [UpdateEventPriceCategoryDto], { nullable: true })
  eventPriceCategory?: UpdateEventPriceCategoryDto[];
}

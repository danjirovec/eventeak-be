import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  IsDefined,
  IsBoolean,
} from 'class-validator';
import { Category, Language, TemplateType } from 'src/enum/enum';
import { CreateEventPriceCategoryDto } from 'src/event.price.category/event.price.category.dto/event.price.category.create.dto';

@InputType('CreateEventTemplate')
export class CreateEventTemplateDto {
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
  @IsEnum(TemplateType, { each: true })
  @Field(() => TemplateType)
  type!: TemplateType;

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

  @IsOptional()
  @Field(() => [CreateEventPriceCategoryDto], { nullable: true })
  eventPriceCategory?: CreateEventPriceCategoryDto[];
}

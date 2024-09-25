import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

@InputType('CreateEventPriceCategory')
export class CreateEventPriceCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  price!: number;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  endDate?: Date;

  @IsOptional()
  @IsString()
  @Field(() => ID)
  sectionId!: string;
}

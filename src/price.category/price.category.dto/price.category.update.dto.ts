import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

@InputType('UpdatePriceCategory')
export class UpdatePriceCategoryDto {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  price?: number;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  endDate?: Date;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  templateId!: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  sectionId?: string;
}

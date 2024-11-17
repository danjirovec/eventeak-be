import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, IsOptional } from 'class-validator';

@InputType('UpdateDiscount')
export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsNumber()
  @Field()
  percentage!: number;
}

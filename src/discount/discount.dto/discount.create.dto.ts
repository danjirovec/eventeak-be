import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

@InputType('CreateDiscount')
export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  percentage!: number;

  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;
}

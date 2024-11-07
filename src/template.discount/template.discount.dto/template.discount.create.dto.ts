import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateTemplateDiscount')
export class CreateTemplateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  templateId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  discountId!: string;
}

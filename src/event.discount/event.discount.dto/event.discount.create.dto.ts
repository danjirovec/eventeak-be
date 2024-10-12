import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateEventDiscount')
export class CreateEventDiscountDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  eventId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  discountId!: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType('EventCheckoutInput')
export class EventCheckoutInputDto {
  @IsNotEmpty()
  @Field(() => ID)
  eventId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;
}

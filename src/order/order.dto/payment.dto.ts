import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType('Payment')
export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  paymentIntent!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  publishableKey?: string;
}

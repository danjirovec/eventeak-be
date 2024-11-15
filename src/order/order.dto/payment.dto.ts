import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType('Payment')
export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  paymentId!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  clientSecret!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  publishableKey?: string;
}

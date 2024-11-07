import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType('CreateOrder')
export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  total!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID, { nullable: true })
  userId?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

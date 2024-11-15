import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentType } from 'src/enum/enum';

@InputType('CreateOrder')
export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  total!: number;

  @IsDefined()
  @IsEnum(PaymentType, { each: true })
  @Field(() => PaymentType, {
    defaultValue: PaymentType.Ticket,
  })
  paymentType!: PaymentType;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  paymentId?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  userId?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

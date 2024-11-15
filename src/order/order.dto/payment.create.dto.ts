import { Field, InputType } from '@nestjs/graphql';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Currency, PaymentType } from 'src/enum/enum';

@InputType('CreatePayment')
export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  amount!: number;

  @IsDefined()
  @IsEnum(Currency, { each: true })
  @Field(() => Currency, { defaultValue: Currency.CZK })
  currency!: Currency;

  @IsNotEmpty()
  @IsString()
  @Field()
  email!: string;

  @IsDefined()
  @IsEnum(PaymentType, { each: true })
  @Field(() => PaymentType, { defaultValue: PaymentType.Ticket })
  paymentType!: PaymentType;
}

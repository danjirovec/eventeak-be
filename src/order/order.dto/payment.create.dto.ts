import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Currency } from 'src/enum/enum';

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
}

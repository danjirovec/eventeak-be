import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { Currency } from 'src/enum/enum';

@InputType('CreateBusiness')
export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  logoUrl?: string;

  @IsDefined()
  @IsEnum(Currency, { each: true })
  @Field(() => Currency)
  currency!: Currency;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId!: string;
}

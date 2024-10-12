import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

@InputType('CreateBenefit')
export class CreateBenefitDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  points!: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  expiryDate?: Date;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  membershipTypeId?: string;
}

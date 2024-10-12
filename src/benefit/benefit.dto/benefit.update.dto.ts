import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

@InputType('UpdateBenefit')
export class UpdateBenefitDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  points?: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  membershipTypeId?: string;
}

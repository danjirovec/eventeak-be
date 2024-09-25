import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateUserBenefit')
export class CreateUserBenefitDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  benefitId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

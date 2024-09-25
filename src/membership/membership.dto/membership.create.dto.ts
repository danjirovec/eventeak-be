import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('CreateMembership')
export class CreateMembershipDto {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  points?: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  expiryDate?: Date;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId!: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  membershipTypeId?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

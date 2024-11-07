import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsDate, IsOptional, IsString } from 'class-validator';

@InputType('UpdateMembership')
export class UpdateMembershipDto {
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
  userId?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  membershipTypeId?: string;
}

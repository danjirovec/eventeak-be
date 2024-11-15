import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { MembershipState } from 'src/enum/enum';

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
  @IsEnum(MembershipState, { each: true })
  @Field(() => MembershipState, {
    defaultValue: MembershipState.Active,
  })
  state!: MembershipState;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  userId?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  membershipTypeId?: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  IsDefined,
  IsEnum,
} from 'class-validator';
import { MembershipState } from 'src/enum/enum';
import { CreateOrderDto } from 'src/order/order.dto/order.create.dto';

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

  @IsDefined()
  @IsEnum(MembershipState, { each: true })
  @Field(() => MembershipState, { defaultValue: MembershipState.Active })
  state!: MembershipState;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  membershipTypeId?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;

  @IsNotEmpty()
  @Field(() => CreateOrderDto)
  order!: CreateOrderDto;
}

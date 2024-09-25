import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';

@InputType('CreateTicket')
export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  price!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  validated!: boolean;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  userId?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  discountId?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  seatId?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  eventId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  sectionId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

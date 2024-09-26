import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

@InputType('UpdateTicket')
export class UpdateTicketDto {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  price?: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  validated?: Date;

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
  @Field(() => ID, { nullable: true })
  eventId!: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  sectionId!: string;
}

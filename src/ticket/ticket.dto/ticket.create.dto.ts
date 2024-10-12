import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';

@InputType('CreateTicket')
export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  price!: number;

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

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  rowId?: string;

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

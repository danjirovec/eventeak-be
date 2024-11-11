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

@InputType('CreateTicketExtra')
export class CreateTicketExtraDto {
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
  @Field({ nullable: true })
  discount?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  seatId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  seat?: number;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  rowId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  row?: string;

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
  @Field()
  section!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import JSON from 'graphql-type-json';

@InputType('VenueSection')
export class VenueSectionDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  capacity!: number;
}

@InputType('CreateVenue')
export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  capacity!: number;

  @IsNotEmpty()
  @IsString()
  @Field()
  city!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  street!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  buildingNumber!: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  hasSeats!: boolean;

  @IsOptional()
  @Field(() => [VenueSectionDto], { nullable: true })
  sections?: VenueSectionDto[];

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  data?: any;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

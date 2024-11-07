import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

@InputType('UpdateVenueSection')
export class UpdateVenueSectionDto {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id?: string;

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
  @Field(() => ID)
  venueId!: string;
}

@InputType('UpdateVenue')
export class UpdateVenueDto {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  id!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  capacity?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  city?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  street?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  buildingNumber?: string;

  @IsOptional()
  @Field(() => [UpdateVenueSectionDto], { nullable: true })
  sections?: UpdateVenueSectionDto[];
}

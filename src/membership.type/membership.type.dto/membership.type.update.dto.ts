import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType('UpdateMembershipType')
export class UpdateMembershipTypeDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  pointsPerTicket?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  price?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;
}

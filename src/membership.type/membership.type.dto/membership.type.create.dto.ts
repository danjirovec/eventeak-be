import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType('CreateMembershipType')
export class CreateMembershipTypeDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  pointsPerTicket!: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  price!: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

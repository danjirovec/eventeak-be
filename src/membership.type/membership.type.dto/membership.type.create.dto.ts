import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('CreateMembershipType')
export class CreateMembershipTypeDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}

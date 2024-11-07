import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

@InputType('UpdateOrder')
export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  total!: number;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  userId?: string;
}

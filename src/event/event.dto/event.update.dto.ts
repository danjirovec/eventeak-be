import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import JSON from 'graphql-type-json';

@InputType('UpdateEvent')
export class UpdateEventDto {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  id!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date?: Date;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  seatMap?: any;
}

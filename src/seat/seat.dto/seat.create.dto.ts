import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType('CreateSeat')
export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  row!: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  seat!: number;

  @IsNotEmpty()
  @IsString()
  @Field()
  sectionId!: string;
}

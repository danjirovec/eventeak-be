import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

@InputType('CreateSection')
export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  capacity?: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  venueId!: string;
}

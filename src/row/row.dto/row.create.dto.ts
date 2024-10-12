import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateRow')
export class CreateRowDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  sectionId!: string;
}

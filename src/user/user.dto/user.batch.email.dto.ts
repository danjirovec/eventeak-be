import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType('BatchUserEmail')
export class BatchUserEmailDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  subject!: string;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [String])
  emails!: [string];

  @IsNotEmpty()
  @IsString()
  @Field()
  message!: string;
}

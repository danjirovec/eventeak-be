import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('UserEmail')
export class UserEmailDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  subject!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  message!: string;
}

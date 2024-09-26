import { IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType('UpdatePassword')
export class UpdatePasswordDto {
  @IsOptional()
  @IsString()
  @Field(() => ID)
  userId!: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @Field()
  password!: string;
}

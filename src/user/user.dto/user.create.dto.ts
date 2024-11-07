import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType('CreateUser')
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  placeOfResidence?: string;

  @IsNotEmpty()
  @IsDate()
  @Field()
  birthDate!: Date;
}

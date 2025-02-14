import {
  IsDate,
  isDate,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType('UpdateUser')
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lastName?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  placeOfResidence?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  avatarUrl?: string;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  deleted?: Date;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  defaultBusinessId?: string;
}

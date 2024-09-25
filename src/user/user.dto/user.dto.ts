import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, GraphQLISODateTime, ID } from '@nestjs/graphql';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';

@FilterableRelation('defaultBusiness', () => BusinessDto, { nullable: true })
@ObjectType('User')
export class UserDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  lastName!: string;

  @IsOptional()
  @IsString()
  @FilterableField({ nullable: true })
  placeOfResidence?: string;

  @IsOptional()
  @IsString()
  @FilterableField({ nullable: true })
  avatarUrl?: string;

  @IsNotEmpty()
  @IsDateString()
  @FilterableField()
  birthDate!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { ObjectType, GraphQLISODateTime, ID } from '@nestjs/graphql';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MembershipTypeDto } from 'src/membership.type/membership.type.dto/membership.type.dto';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';

@ObjectType('UserProfile')
export class UserProfileDto {
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

  @IsOptional()
  @FilterableField({ nullable: true })
  membership?: MembershipDto;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  eventsVisited!: number;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  benefitsUsed!: number;
}

import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { Role } from 'src/enum/enum';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('BusinessUser')
@FilterableRelation('user', () => UserDto)
@FilterableRelation('business', () => BusinessDto)
export class BusinessUserDto {
  @IsDefined()
  @IsEnum(Role, { each: true })
  @FilterableField(() => Role, { defaultValue: Role.Customer })
  role!: Role;

  @IsString()
  @FilterableField({ filterOnly: true })
  userId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

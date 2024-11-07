import { ID, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty, IsDate, IsOptional, IsString } from 'class-validator';
import { MembershipDto } from './membership.dto';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('UserMembership')
export class UserMembershipDto {
  @IsOptional()
  @FilterableField({ nullable: true })
  membership?: MembershipDto;

  @IsNotEmpty()
  @FilterableField(() => ID)
  user!: UserDto;

  //   @IsOptional()
  //   @IsString()
  //   @Field(() => ID, { nullable: true })
  //   membershipId?: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   @Field(() => ID)
  //   userId!: string;
}

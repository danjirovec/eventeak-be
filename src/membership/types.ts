import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserMembershipDto } from './membership.dto/user.membership.dto';

@ArgsType()
export class UserMembershipQuery extends QueryArgsType(UserMembershipDto, {
  connectionName: 'UserMembershipConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const UserMembershipConnection = UserMembershipQuery.ConnectionType;

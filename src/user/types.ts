import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserDto } from './user.dto/user.dto';

@ArgsType()
export class UserQuery extends QueryArgsType(UserDto, {
  connectionName: 'UserConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const UserConnection = UserQuery.ConnectionType;

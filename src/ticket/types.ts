import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { TicketDto } from './ticket.dto/ticket.dto';

@ArgsType()
export class TicketQuery extends QueryArgsType(TicketDto, {
  connectionName: 'TicketConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const TicketConnection = TicketQuery.ConnectionType;

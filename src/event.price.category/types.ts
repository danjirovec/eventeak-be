import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { EventPriceCategoryDto } from './event.price.category.dto/event.price.category.dto';

@ArgsType()
export class EventPriceCategoryQuery extends QueryArgsType(
  EventPriceCategoryDto,
  {
    connectionName: 'EventPriceCategoryConnection',
    pagingStrategy: PagingStrategies.OFFSET,
    enableTotalCount: true,
  },
) {}
export const EventPriceCategoryConnection =
  EventPriceCategoryQuery.ConnectionType;

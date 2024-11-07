import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { PriceCategoryDto } from './price.category.dto/price.category.dto';

@ArgsType()
export class EventPriceCategoryQuery extends QueryArgsType(PriceCategoryDto, {
  connectionName: 'EventPriceCategoryConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const EventPriceCategoryConnection =
  EventPriceCategoryQuery.ConnectionType;

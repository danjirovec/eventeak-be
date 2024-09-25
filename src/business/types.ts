import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { BusinessDto } from './business.dto/business.dto';

@ArgsType()
export class BusinessQuery extends QueryArgsType(BusinessDto, {
  connectionName: 'BusinessConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const BusinessConnection = BusinessQuery.ConnectionType;

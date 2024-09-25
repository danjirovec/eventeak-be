import { PagingStrategies, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { BenefitDto } from './benefit.dto/benefit.dto';

@ArgsType()
export class BenefitQuery extends QueryArgsType(BenefitDto, {
  connectionName: 'BenefitConnection',
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
}) {}
export const BenefitConnection = BenefitQuery.ConnectionType;

import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { OrderDto } from './order.dto/order.dto';
import { Order } from './order.entity/order.entity';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(
    @InjectQueryService(Order)
    readonly ordersService: QueryService<OrderDto>,
  ) {}
}

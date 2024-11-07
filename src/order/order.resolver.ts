import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderDto } from './order.dto/order.dto';
import { Order } from './order.entity/order.entity';
import { OrderGraphDto } from './order.dto/order.graph.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(
    @InjectQueryService(Order)
    readonly orderService: QueryService<OrderDto>,
  ) {}

  @Query(() => [OrderGraphDto])
  @UseGuards(AuthGuard)
  async getOrderTotals(@Args('meta') meta: string): Promise<OrderGraphDto[]> {
    const lastYear = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    );
    const orders = await this.orderService.query({
      filter: {
        and: [{ businessId: { eq: meta } }, { created: { gt: lastYear } }],
      },
    });
    const monthlyTotals = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthString = date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      return {
        date: monthString,
        total: 0,
      };
    });

    orders.forEach((order) => {
      const orderMonth = order.created.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      const monthEntry = monthlyTotals.find(
        (entry) => entry.date === orderMonth,
      );
      if (monthEntry) {
        monthEntry.total += order.total;
      }
    });
    return monthlyTotals.reverse();
  }
}

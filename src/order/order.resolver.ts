import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderDto } from './order.dto/order.dto';
import { Order } from './order.entity/order.entity';
import { OrderGraphDto } from './order.dto/order.graph.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { PaymentDto } from './order.dto/payment.dto';
import stripe from 'stripe';
import { CreatePaymentDto } from './order.dto/payment.create.dto';
import { PublishableKeyDto } from './order.dto/publishableKey.dto';
import { ConfigService } from '@nestjs/config';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(
    @InjectQueryService(Order)
    readonly orderService: QueryService<OrderDto>,
    private readonly configService: ConfigService,
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

  @Mutation(() => PublishableKeyDto)
  @UseGuards(AuthGuard)
  async getPublishableKey() {
    return {
      publishableKEy: this.configService.get<string>('PK_KEY'),
    };
  }

  @Mutation(() => PaymentDto)
  @UseGuards(AuthGuard)
  async payment(@Args('input') input: CreatePaymentDto) {
    const stripeee = new stripe.Stripe(
      this.configService.get<string>('SK_KEY'),
    );
    const paymentIntent = await stripeee.paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: this.configService.get<string>('PK_KEY'),
    };
  }
}

import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TicketDto } from './ticket.dto/ticket.dto';
import { Ticket } from './ticket.entity/ticket.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTicketDto } from './ticket.dto/ticket.create.dto';
import { Order } from 'src/order/order.entity/order.entity';
import { OrderDto } from 'src/order/order.dto/order.dto';
import { CreateOrderDto } from 'src/order/order.dto/order.create.dto';
import { TicketSetDto } from './ticket.dto/ticket.user.dto';
import { TicketQuery } from './types';
import { groupBy } from 'src/utils/groupBy';

@Resolver(() => TicketDto)
export class TicketResolver {
  constructor(
    @InjectQueryService(Ticket)
    readonly ticketsService: QueryService<TicketDto>,
    @InjectQueryService(Order)
    readonly ordersService: QueryService<OrderDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => [TicketDto])
  @UseGuards(AuthGuard)
  async createTickets(
    @Args('order') orderInput: CreateOrderDto,
    @Args({ name: 'tickets', type: () => [CreateTicketDto] })
    ticketsInput: CreateTicketDto[],
  ): Promise<TicketDto[]> {
    let tickets = [];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.ordersService.createOne({
        userId: orderInput.userId,
        total: orderInput.total,
        businessId: orderInput.businessId,
      });

      const ticketsToCreate = ticketsInput.map((ticket) => ({
        ...ticket,
        orderId: order.id,
      }));

      tickets = await this.ticketsService.createMany(ticketsToCreate);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return tickets;
  }

  @Query(() => TicketSetDto)
  @UseGuards(AuthGuard)
  async getUserTickets(@Args() query: TicketQuery): Promise<TicketSetDto> {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    const tickets = await this.ticketsService.query({ filter: query.filter });

    const [valid, invalid] = tickets.reduce<[typeof tickets, typeof tickets]>(
      (acc, current) => {
        if (!current.validated) {
          acc[0].push(current);
        } else {
          if (!(current.updated < date)) {
            acc[1].push(current);
          }
        }
        return acc;
      },
      [[], []],
    );

    const groupedValid = groupBy(valid);
    const groupedInvalid = groupBy(invalid);

    return { valid: groupedValid, invalid: groupedInvalid };
  }
}

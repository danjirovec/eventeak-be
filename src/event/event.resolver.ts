import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { EventDto } from './event.dto/event.dto';
import { CreateEventDto } from './event.dto/event.create.dto';
import { UpdateEventDto } from './event.dto/event.update.dto';
import { Venue } from 'src/venue/venue.entity/venue.entity';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';
import { EventCheckoutDto } from './event.dto/event.checkout.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { User } from 'src/user/user.entity/user.entity';
import { UserDto } from 'src/user/user.dto/user.dto';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';
import { Discount } from 'src/discount/discount.entity/discount.entity';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { EventPriceCategoryService } from 'src/event.price.category/event.price.category.service';
import { CreateTicketOrderDto } from 'src/ticket/ticket.dto/ticket.order.create';
import { DataSource } from 'typeorm';
import { Order } from 'src/order/order.entity/order.entity';
import { OrderDto } from 'src/order/order.dto/order.dto';

@Resolver(() => EventDto)
export class EventResolver {
  constructor(
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
    readonly epcService: EventPriceCategoryService,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    @InjectQueryService(Discount)
    readonly discountService: QueryService<DiscountDto>,
    @InjectQueryService(Order)
    readonly orderService: QueryService<OrderDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async createEvent(@Args('input') input: CreateEventDto) {
    let newEvent;
    const epcs = await this.epcService.query({
      filter: { eventTemplateId: { eq: input.eventTemplateId } },
    });
    try {
      const venue = await this.venueService.getById(input.venueId);
      if (venue.hasSeats) {
        const venueData = venue.data;
        Object.keys(venueData.rows).forEach((rowKey) => {
          venueData.rows[rowKey].seats = venueData.rows[rowKey].seats.map(
            (seat) => {
              const epcMatch = epcs.find(
                (epc) => epc.sectionId === seat.sectionId,
              );
              return {
                ...seat,
                epcId: epcMatch ? epcMatch.id : null,
                epcPrice: epcMatch ? epcMatch.price : null,
              };
            },
          );
        });

        newEvent = await this.eventService.createOne({
          ...input,
          venueData: venueData,
        });
      } else {
        newEvent = await this.eventService.createOne({
          ...input,
        });
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
    return newEvent;
  }

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async updateEvent(@Args('input') input: UpdateEventDto) {
    let updatedEvent;
    try {
      const { id, ...rest } = input;
      updatedEvent = await this.eventService.updateOne(id, {
        ...rest,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
    return updatedEvent;
  }

  @Query(() => EventCheckoutDto)
  @UseGuards(AuthGuard)
  async getEventCheckout(
    @Args('meta') meta: string,
  ): Promise<EventCheckoutDto> {
    const input = JSON.parse(meta).meta;
    const businessUsers = await this.businessUserService.query({
      filter: { businessId: { eq: input.businessId } },
    });
    const userIds = businessUsers.map((item) => item.userId);
    const users = await this.userService.query({
      filter: { id: { in: userIds } },
    });

    const discounts = await this.discountService.query({
      filter: { businessId: { eq: input.businessId } },
    });

    const events = await this.eventService.query({
      filter: { businessId: { eq: input.businessId } },
    });

    if (input.eventId) {
      const event = events.find((item) => item.id == input.eventId);
      // const epcs = await this.epcService.query({
      //   filter: { eventTemplateId: { eq: event.eventTemplateId } },
      // });

      const epcs = await this.epcService.getEventPrices(input.eventId, {
        eventTemplateId: { eq: event.eventTemplateId },
      });

      const tickets = await this.ticketService.query({
        filter: { eventId: { eq: event.id } },
      });
      return {
        events: events,
        users: users,
        eventPriceCategories: epcs,
        tickets: tickets,
        discounts: discounts,
      };
    }

    return {
      events: events,
      users: users,
      discounts: discounts,
    };
  }

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async createTickets(
    @Args('input') input: CreateTicketOrderDto,
  ): Promise<EventDto> {
    let event;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderService.createOne({
        userId: input.order.userId,
        total: input.order.total,
        businessId: input.order.businessId,
      });
      const ticketsToCreate = input.tickets.map((ticket) => ({
        ...ticket,
        orderId: order.id,
      }));
      const tickets = await this.ticketService.createMany(ticketsToCreate);
      event = await this.eventService.getById(tickets[0].eventId);
      if (event.venueData) {
        for (const row in event.venueData.rows) {
          event.venueData.rows[row].seats.map((seat, index) => {
            const ticket = tickets.find(
              (item) =>
                item.sectionId == seat.sectionId && item.seatId == seat.seatId,
            );
            if (ticket) {
              event.venueData.rows[row].seats[index].ticketId = ticket.id;
              event.venueData.rows[row].seats[index].reserved = true;
            }
          });
        }
        event = this.eventService.updateOne(event.id, {
          venueData: event.venueData,
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return event;
  }
}

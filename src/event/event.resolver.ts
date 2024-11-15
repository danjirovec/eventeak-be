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
import { CreateTicketOrderDto } from 'src/ticket/ticket.dto/ticket.order.create';
import { DataSource } from 'typeorm';
import { Order } from 'src/order/order.entity/order.entity';
import { OrderDto } from 'src/order/order.dto/order.dto';
import { PriceCategoryService } from 'src/price.category/price.category.service';
import { Template } from 'src/template/template.entity/template.entity';
import { TemplateDto } from 'src/template/template.dto/template.dto';
import { TemplateDiscount } from 'src/template.discount/template.discount.entity/template.discount.entity';
import { TemplateDiscountDto } from 'src/template.discount/template.discount.dto/template.discount.dto';
import { MailService } from 'src/mail/mail.service';
import { Business } from 'src/business/business.entity/business.entity';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { MembershipType } from 'src/membership.type/membership.type.entity/membership.type.entity';
import { MembershipTypeDto } from 'src/membership.type/membership.type.dto/membership.type.dto';
import { CreateMembershipDto } from 'src/membership/membership.dto/membership.create.dto';

@Resolver(() => EventDto)
export class EventResolver {
  constructor(
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
    readonly pcService: PriceCategoryService,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(Business)
    readonly businessService: QueryService<BusinessDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    @InjectQueryService(MembershipType)
    readonly membershipTypeService: QueryService<MembershipTypeDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    @InjectQueryService(Discount)
    readonly discountService: QueryService<DiscountDto>,
    @InjectQueryService(Template)
    readonly templateService: QueryService<TemplateDto>,
    @InjectQueryService(TemplateDiscount)
    readonly templateDiscountService: QueryService<TemplateDiscountDto>,
    @InjectQueryService(Order)
    readonly orderService: QueryService<OrderDto>,
    readonly mailService: MailService,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async createEvent(@Args('input') input: CreateEventDto) {
    let newEvent;
    try {
      const pcs = await this.pcService.query({
        filter: { templateId: { eq: input.templateId } },
      });
      const template = await this.templateService.getById(input.templateId);
      const venue = await this.venueService.getById(template.venueId);
      if (venue.hasSeats) {
        const seatMap = venue.seatMap;
        Object.keys(seatMap.rows).forEach((rowKey) => {
          seatMap.rows[rowKey].seats = seatMap.rows[rowKey].seats.map(
            (seat) => {
              const pcMatch = pcs.find((pc) => pc.sectionId === seat.sectionId);
              return {
                ...seat,
                pcId: pcMatch ? pcMatch.id : null,
                pcPrice: pcMatch ? pcMatch.price : null,
              };
            },
          );
        });

        newEvent = await this.eventService.createOne({
          ...input,
          seatMap: seatMap,
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

    const events = await this.eventService.query({
      filter: { businessId: { eq: input.businessId } },
    });

    if (input.eventId) {
      const event = events.find((item) => item.id == input.eventId);
      const pcs = await this.pcService.getEventPrices(input.eventId, {
        templateId: { eq: event.templateId },
      });
      const templateDiscounts = await this.templateDiscountService.query({
        filter: { templateId: { eq: event.templateId } },
      });
      const discountIds = templateDiscounts.map((item) => item.discountId);
      let discounts = [];
      if (discountIds.length > 0) {
        discounts = await this.discountService.query({
          filter: { id: { in: discountIds } },
        });
      }
      const tickets = await this.ticketService.query({
        filter: { eventId: { eq: event.id } },
      });
      return {
        events: events,
        users: users,
        priceCategories: pcs,
        tickets: tickets,
        discounts: discounts,
      };
    }

    return {
      events: events,
      users: users,
    };
  }

  @Mutation(() => MembershipDto)
  @UseGuards(AuthGuard)
  async createMembership(@Args('input') input: CreateMembershipDto) {
    let membership;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { order, ...rest } = input;
      await this.orderService.createOne({
        userId: order.userId,
        total: order.total,
        businessId: order.businessId,
        paymentId: order.paymentId,
        paymentType: order.paymentType,
      });

      membership = await this.membershipService.createOne(rest);

      if (order.userId) {
        const user = await this.userService.getById(input.order.userId);
        const business = await this.businessService.getById(
          input.order.businessId,
        );
        const membershipType = await this.membershipTypeService.getById(
          membership.membershipTypeId,
        );
        await this.mailService.sendMembership(
          user,
          business,
          membership,
          membershipType,
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return membership;
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
        paymentId: input.order.paymentId,
        paymentType: input.order.paymentType,
      });
      const ticketsToCreate = input.tickets.map((ticket) => {
        const { seat, row, discount, section, ...rest } = ticket;
        return {
          ...rest,
          orderId: order.id,
        };
      });
      const tickets = await this.ticketService.createMany(ticketsToCreate);
      event = await this.eventService.getById(tickets[0].eventId);
      if (event.seatMap) {
        for (const row in event.seatMap.rows) {
          event.seatMap.rows[row].seats.map((seat, index) => {
            const ticket = tickets.find(
              (item) =>
                item.sectionId == seat.sectionId &&
                item.seatId == seat.seatId &&
                item.rowId == seat.rowId,
            );
            if (ticket) {
              event.seatMap.rows[row].seats[index].ticketId = ticket.id;
              event.seatMap.rows[row].seats[index].reserved = true;
            }
          });
        }
        event = await this.eventService.updateOne(event.id, {
          seatMap: event.seatMap,
        });
      }
      if (input.order.userId) {
        const membership = await this.membershipService.query({
          filter: {
            and: [
              { userId: { eq: input.order.userId } },
              { businessId: { eq: input.order.businessId } },
            ],
          },
        });
        if (membership.length > 0) {
          const membershipType = await this.membershipTypeService.getById(
            membership[0].membershipTypeId,
          );
          await this.membershipService.updateOne(membership[0].id, {
            points:
              membership[0].points +
              membershipType.pointsPerTicket * input.tickets.length,
          });
        }
        const user = await this.userService.getById(input.order.userId);
        const business = await this.businessService.getById(
          input.order.businessId,
        );
        const emailTickets = input.tickets.map((item, index) => ({
          id: tickets[index].id.slice(0, 8),
          price: item.price,
          section: item.section,
          discount: item.discount ? item.discount : null,
          seat: item.seat ? item.seat : null,
          row: item.row ? item.row : null,
        }));
        await this.mailService.sendTickets(emailTickets, user, business, event);
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

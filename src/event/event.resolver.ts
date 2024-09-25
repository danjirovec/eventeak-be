import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DataSource } from 'typeorm';
import { EventPriceCategory } from 'src/event.price.category/event.price.category.entity/event.price.category.entity';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { EventPriceCategoryDto } from 'src/event.price.category/event.price.category.dto/event.price.category.dto';
import { EventDto } from './event.dto/event.dto';
import { CreateEventDto } from './event.dto/event.create.dto';
import { UpdateEventDto } from './event.dto/event.update.dto';
import { EventTemplate } from 'src/event.template/event.template.entity/event.template.entity';
import { EventTemplateDto } from 'src/event.template/event.template.dto/event.template.dto';
import { Venue } from 'src/venue/venue.entity/venue.entity';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { Seat } from 'src/seat/seat.entity/seat.entity';
import { SeatDto } from 'src/seat/seat.dto/seat.dto';
import { Section } from 'src/section/section.entity/section.entity';
import { SectionDto } from 'src/section/section.dto/section.dto';

@Resolver(() => EventDto)
export class EventResolver {
  constructor(
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(EventTemplate)
    readonly eventTemplateService: QueryService<EventTemplateDto>,
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
    @InjectQueryService(Seat)
    readonly seatService: QueryService<SeatDto>,
    @InjectQueryService(Section)
    readonly sectionService: QueryService<SectionDto>,
    @InjectQueryService(EventPriceCategory)
    readonly eventPriceCategoryService: QueryService<EventPriceCategoryDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async createEvent(@Args('input') input: CreateEventDto) {
    let newEvent;
    const tickets = [];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const venue = await this.venueService.getById(input.venueId);
      const priceCategories = await this.eventPriceCategoryService.query({
        filter: { eventTemplateId: { eq: input.eventTemplateId } },
      });
      if (venue.hasSeats) {
        const venueData = venue.data;
        newEvent = await this.eventService.createOne({
          ...input,
          venueData: venueData,
        });

        const sections = await this.sectionService.query({
          filter: { venueId: { eq: venue.id } },
        });
        for (const sec of sections) {
          const price = priceCategories.find(
            (item) => item.sectionId == sec.id,
          );
          const seats = await this.seatService.query({
            filter: { sectionId: { eq: sec.id } },
          });
          // for (const seat of seats) {
          //   tickets.push({
          //     price: price.price,
          //     validated: false,
          //     eventId: newEvent.id,
          //     sectionId: sec.id,
          //     seatId: seat.id,
          //   });
          // }
        }
      } else {
        newEvent = await this.eventService.createOne({
          ...input,
        });
        const sections = await this.sectionService.query({
          filter: { venueId: { eq: venue.id } },
        });
        for (const sec of sections) {
          const price = priceCategories.find(
            (item) => item.sectionId == sec.id,
          );
          for (let i = 0; i < sec.capacity; i++) {
            // tickets.push({
            //   price: price.price,
            //   validated: false,
            //   eventId: newEvent.id,
            //   sectionId: sec.id,
            // });
          }
        }
      }
      // const newTickets = await this.ticketService.createMany(tickets);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return newEvent;
  }

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async updateEvent(@Args('input') input: UpdateEventDto) {
    let updatedEvent;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, ...rest } = input;
      updatedEvent = await this.eventService.updateOne(id, {
        ...rest,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return updatedEvent;
  }
}

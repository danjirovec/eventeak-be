import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EventPriceCategoryDto } from './event.price.category.dto/event.price.category.dto';
import { EventPriceCategory } from './event.price.category.entity/event.price.category.entity';
import { EventPriceCategoryConnection, EventPriceCategoryQuery } from './types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { Section } from 'src/section/section.entity/section.entity';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { EventPriceCategoryAvailableDto } from './event.price.category.dto/event.price.category.available';

@Resolver(() => EventPriceCategoryDto)
export class EventPriceCategoryResolver {
  constructor(
    @InjectQueryService(EventPriceCategory)
    readonly eventPriceCategoryService: QueryService<EventPriceCategoryDto>,
    @InjectQueryService(Ticket)
    readonly ticketsService: QueryService<TicketDto>,
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
  ) {}

  @Query(() => EventPriceCategoryAvailableDto)
  @UseGuards(AuthGuard)
  async prices(
    @Args() query: EventPriceCategoryQuery,
    @Args('meta', { nullable: true }) meta?: string,
  ): Promise<EventPriceCategoryAvailableDto> {
    const prices = await this.eventPriceCategoryService.query({
      filter: query.filter,
      paging: query.paging,
      sorting: query.sorting,
    });

    const result = [];
    const counts = [];

    for (const price of prices) {
      const count = await this.ticketsService.count({
        and: [
          { eventId: { eq: meta } },
          { sectionId: { eq: price.sectionId } },
        ],
      });
      const section = await this.sectionsService.getById(price.sectionId);

      if (count < section.capacity) {
        result.push(price);
        counts.push(section.capacity - count);
      }
    }

    return { nodes: result, counts: counts };
  }
}

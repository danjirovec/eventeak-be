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
import { EventPriceCategoryService } from './event.price.category.service';

@Resolver(() => EventPriceCategoryDto)
export class EventPriceCategoryResolver {
  constructor(
    readonly eventPriceCategoryService: EventPriceCategoryService,
    @InjectQueryService(Ticket)
    readonly ticketsService: QueryService<TicketDto>,
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
  ) {}

  @Query(() => EventPriceCategoryAvailableDto)
  @UseGuards(AuthGuard)
  async getEventPrices(
    @Args() query: EventPriceCategoryQuery,
    @Args('meta') meta: string,
  ): Promise<EventPriceCategoryAvailableDto> {
    const epcs = await this.eventPriceCategoryService.getEventPrices(
      meta,
      query.filter,
      query.paging,
      query.sorting,
    );
    return epcs;
  }
}

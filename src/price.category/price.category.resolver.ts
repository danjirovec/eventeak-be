import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PriceCategoryDto } from './price.category.dto/price.category.dto';
import { PriceCategory } from './price.category.entity/price.category.entity';
import { EventPriceCategoryConnection, EventPriceCategoryQuery } from './types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { Section } from 'src/section/section.entity/section.entity';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { PriceCategoryAvailableDto } from './price.category.dto/price.category.available';
import { PriceCategoryService } from './price.category.service';

@Resolver(() => PriceCategoryDto)
export class PriceCategoryResolver {
  constructor(
    readonly eventPriceCategoryService: PriceCategoryService,
    @InjectQueryService(Ticket)
    readonly ticketsService: QueryService<TicketDto>,
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
  ) {}

  @Query(() => PriceCategoryAvailableDto)
  @UseGuards(AuthGuard)
  async getEventPrices(
    @Args() query: EventPriceCategoryQuery,
    @Args('meta') meta: string,
  ): Promise<PriceCategoryAvailableDto> {
    const epcs = await this.eventPriceCategoryService.getEventPrices(
      meta,
      query.filter,
      query.paging,
      query.sorting,
    );
    return epcs;
  }
}

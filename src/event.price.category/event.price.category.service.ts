import { QueryService, InjectQueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPriceCategory } from './event.price.category.entity/event.price.category.entity';
import { Section } from 'src/section/section.entity/section.entity';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { EventPriceCategoryAvailableDto } from './event.price.category.dto/event.price.category.available';
import { EventDto } from 'src/event/event.dto/event.dto';

@QueryService(EventPriceCategory)
export class EventPriceCategoryService extends TypeOrmQueryService<EventPriceCategory> {
  constructor(
    @InjectRepository(EventPriceCategory) repo: Repository<EventPriceCategory>,
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
    @InjectQueryService(Ticket)
    readonly ticketsService: QueryService<TicketDto>,
  ) {
    super(repo);
  }

  async getEventPrices(
    meta: any,
    filter?: any,
    paging?: any,
    sorting?: any,
  ): Promise<EventPriceCategoryAvailableDto> {
    const prices = await this.query({
      filter: filter,
      paging: paging,
      sorting: sorting,
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
      if (section.capacity) {
        if (count < section.capacity) {
          result.push(price);
          counts.push(section.capacity - count);
        }
      } else {
        result.push(price);
      }
    }

    return { nodes: result, counts: counts };
  }
}

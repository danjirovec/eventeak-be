import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { EventDiscountDto } from './event.discount.dto/event.discount.dto';
import { EventDiscount } from './event.discount.entity/event.discount.entity';

@Resolver(() => EventDiscountDto)
export class EventDiscountResolver {
  constructor(
    @InjectQueryService(EventDiscount)
    readonly eventDiscountService: QueryService<EventDiscountDto>,
  ) {}
}

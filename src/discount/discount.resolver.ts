import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { DiscountDto } from './discount.dto/discount.dto';
import { Discount } from './discount.entity/discount.entity';

@Resolver(() => DiscountDto)
export class DiscountResolver {
  constructor(
    @InjectQueryService(Discount)
    readonly sectionsService: QueryService<DiscountDto>,
  ) {}
}

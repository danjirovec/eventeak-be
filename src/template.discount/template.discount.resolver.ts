import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { TemplateDiscountDto } from './template.discount.dto/template.discount.dto';
import { TemplateDiscount } from './template.discount.entity/template.discount.entity';

@Resolver(() => TemplateDiscountDto)
export class TemplateDiscountResolver {
  constructor(
    @InjectQueryService(TemplateDiscount)
    readonly eventDiscountService: QueryService<TemplateDiscountDto>,
  ) {}
}

import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { SectionDto } from './section.dto/section.dto';
import { Section } from './section.entity/section.entity';

@Resolver(() => SectionDto)
export class SectionResolver {
  constructor(
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
  ) {}
}

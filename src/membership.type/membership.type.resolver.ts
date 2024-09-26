import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { MembershipType } from './membership.type.entity/membership.type.entity';
import { MembershipTypeDto } from './membership.type.dto/membership.type.dto';

@Resolver(() => MembershipTypeDto)
export class MembershipTypeResolver {
  constructor(
    @InjectQueryService(MembershipType)
    readonly sectionsService: QueryService<MembershipTypeDto>,
  ) {}
}

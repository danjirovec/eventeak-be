import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';

@Resolver(() => MembershipDto)
export class MembershipResolver {
  constructor(
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
  ) {}
}

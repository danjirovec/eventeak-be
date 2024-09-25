import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { UserBenefitDto } from './user.benefit.dto/user.benefit.dto';
import { UserBenefit } from './user.benefit.entity/user.benefit.entity';

@Resolver(() => UserBenefitDto)
export class UserBenefitResolver {
  constructor(
    @InjectQueryService(UserBenefit)
    readonly membershipService: QueryService<UserBenefitDto>,
  ) {}
}

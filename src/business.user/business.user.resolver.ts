import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { BusinessUser } from './business.user.entity/business.user.entity';
import { BusinessUserDto } from './business.user.dto/business.user.dto';

@Resolver(() => BusinessUserDto)
export class BusinessUserResolver {
  constructor(
    @InjectQueryService(BusinessUser)
    readonly seatsService: QueryService<BusinessUserDto>,
  ) {}
}

import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { SeatDto } from './seat.dto/seat.dto';
import { Seat } from './seat.entity/seat.entity';

@Resolver(() => SeatDto)
export class SeatResolver {
  constructor(
    @InjectQueryService(Seat)
    readonly seatsService: QueryService<SeatDto>,
  ) {}
}

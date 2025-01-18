import { ID, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@ObjectType('EventTicketSold')
export class EventTicketSoldDto {
  @FilterableField()
  capacity: number;

  @FilterableField()
  sold: number;

  @FilterableField(() => ID)
  eventId: string;
}

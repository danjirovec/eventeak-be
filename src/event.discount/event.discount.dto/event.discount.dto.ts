import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { EventDto } from 'src/event/event.dto/event.dto';

@ObjectType()
@FilterableRelation('discount', () => DiscountDto)
@FilterableRelation('event', () => EventDto)
export class EventDiscountDto {
  @IsString()
  @FilterableField({ filterOnly: true })
  discountId!: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  eventId!: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;
}

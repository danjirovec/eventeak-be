import { ObjectType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty } from 'class-validator';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { EventDto } from './event.dto';
import { UserDto } from 'src/user/user.dto/user.dto';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { EventPriceCategoryAvailableDto } from 'src/event.price.category/event.price.category.dto/event.price.category.available';

@ObjectType('EventCheckoutDto')
export class EventCheckoutDto {
  @IsNotEmpty()
  @FilterableField(() => EventPriceCategoryAvailableDto, { nullable: true })
  eventPriceCategories?: EventPriceCategoryAvailableDto;

  @IsNotEmpty()
  @FilterableField(() => [TicketDto], { nullable: true })
  tickets?: TicketDto[];

  @IsNotEmpty()
  @FilterableField(() => [EventDto])
  events!: EventDto[];

  @IsNotEmpty()
  @FilterableField(() => [UserDto])
  users: UserDto[];

  @IsNotEmpty()
  @FilterableField(() => [DiscountDto])
  discounts: DiscountDto[];
}

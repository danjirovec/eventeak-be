import { ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { EventDto } from './event.dto';
import { UserDto } from 'src/user/user.dto/user.dto';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { PriceCategoryAvailableDto } from 'src/price.category/price.category.dto/price.category.available';

@ObjectType('EventCheckoutDto')
export class EventCheckoutDto {
  @IsOptional()
  @FilterableField(() => PriceCategoryAvailableDto, { nullable: true })
  priceCategories?: PriceCategoryAvailableDto;

  @IsOptional()
  @FilterableField(() => [TicketDto], { nullable: true })
  tickets?: TicketDto[];

  @IsNotEmpty()
  @FilterableField(() => [EventDto])
  events!: EventDto[];

  @IsNotEmpty()
  @FilterableField(() => [UserDto])
  users: UserDto[];

  @IsOptional()
  @FilterableField(() => [DiscountDto], { nullable: true })
  discounts?: DiscountDto[];
}

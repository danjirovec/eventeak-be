import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { EventDto } from 'src/event/event.dto/event.dto';
import { OrderDto } from 'src/order/order.dto/order.dto';
import { SeatDto } from 'src/seat/seat.dto/seat.dto';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { UserDto } from 'src/user/user.dto/user.dto';

@ObjectType('Ticket')
@FilterableRelation('event', () => EventDto)
@FilterableRelation('section', () => SectionDto)
@FilterableRelation('user', () => UserDto, { nullable: true })
@FilterableRelation('seat', () => SeatDto, { nullable: true })
@FilterableRelation('discount', () => DiscountDto, { nullable: true })
@FilterableRelation('order', () => OrderDto, { nullable: true })
@FilterableRelation('business', () => BusinessDto)
export class TicketDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  price!: number;

  @IsOptional()
  @IsDate()
  @FilterableField({ nullable: true })
  validated?: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  eventId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  sectionId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  businessId?: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  userId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

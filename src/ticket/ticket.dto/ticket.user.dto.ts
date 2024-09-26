import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TicketDto } from './ticket.dto';

@ObjectType('UserTickets')
export class UserTicketsDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @Field(() => [TicketDto])
  ticketSet!: TicketDto[];
}

@ObjectType('TicketSet')
export class TicketSetDto {
  @IsNotEmpty()
  @Field(() => [UserTicketsDto])
  valid!: UserTicketsDto[];

  @IsNotEmpty()
  @Field(() => [UserTicketsDto])
  invalid!: UserTicketsDto[];
}

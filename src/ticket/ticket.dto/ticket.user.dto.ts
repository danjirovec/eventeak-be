import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TicketDto } from './ticket.dto';

@ObjectType('TicketAgg')
export class TicketAggDto {
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
  @Field(() => [TicketAggDto])
  valid!: TicketAggDto[];

  @IsNotEmpty()
  @Field(() => [TicketAggDto])
  invalid!: TicketAggDto[];
}

import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateTicketExtraDto } from './ticket.create.dto';
import { CreateOrderDto } from 'src/order/order.dto/order.create.dto';

@InputType('CreateTicketOrder')
export class CreateTicketOrderDto {
  @IsNotEmpty()
  @Field(() => [CreateTicketExtraDto])
  tickets!: CreateTicketExtraDto[];

  @IsNotEmpty()
  @Field(() => CreateOrderDto)
  order!: CreateOrderDto;
}

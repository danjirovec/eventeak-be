import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType('EventSeatMap')
export class EventSeatMapDto {
  @IsNotEmpty()
  @Field(() => JSON)
  seatMap!: any;
}

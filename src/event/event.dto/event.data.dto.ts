import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType('EventData')
export class EventDataDto {
  @IsNotEmpty()
  @Field(() => JSON)
  eventData!: any;
}

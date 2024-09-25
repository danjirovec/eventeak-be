import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { EventPriceCategoryDto } from './event.price.category.dto';

@ObjectType('EventPriceCategoryAvailable')
export class EventPriceCategoryAvailableDto {
  @IsNotEmpty()
  @Field(() => [EventPriceCategoryDto])
  nodes!: EventPriceCategoryDto[];

  @IsNotEmpty()
  @Field(() => [Number])
  counts!: number[];
}

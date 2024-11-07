import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PriceCategoryDto } from './price.category.dto';

@ObjectType('PriceCategoryAvailable')
export class PriceCategoryAvailableDto {
  @IsNotEmpty()
  @Field(() => [PriceCategoryDto])
  nodes!: PriceCategoryDto[];

  @IsNotEmpty()
  @Field(() => [Number])
  counts!: number[];
}

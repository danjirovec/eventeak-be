import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsString,
} from 'class-validator';
import { SectionDto } from 'src/section/section.dto/section.dto';

@ObjectType('Seat')
@FilterableRelation('section', () => SectionDto)
export class SeatDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  row!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  seat!: number;

  @IsString()
  @FilterableField({ filterOnly: true })
  sectionId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

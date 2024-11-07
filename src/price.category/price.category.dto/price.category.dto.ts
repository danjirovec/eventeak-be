import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TemplateDto } from 'src/template/template.dto/template.dto';
import { SectionDto } from 'src/section/section.dto/section.dto';

@ObjectType('PriceCategory')
@FilterableRelation('section', () => SectionDto)
@FilterableRelation('template', () => TemplateDto)
export class PriceCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  @IDField(() => ID)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @FilterableField()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  price!: number;

  @IsOptional()
  @IsDateString()
  @FilterableField({ nullable: true })
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @FilterableField({ nullable: true })
  endDate?: Date;

  @IsString()
  @FilterableField({ filterOnly: true })
  sectionId!: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  templateId?: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { DiscountDto } from 'src/discount/discount.dto/discount.dto';
import { TemplateDto } from 'src/template/template.dto/template.dto';

@ObjectType('TemplateDiscount')
@FilterableRelation('discount', () => DiscountDto)
@FilterableRelation('template', () => TemplateDto)
export class TemplateDiscountDto {
  @IsString()
  @FilterableField({ filterOnly: true })
  discountId!: string;

  @IsString()
  @FilterableField({ filterOnly: true })
  templateId!: string;

  @IsNotEmpty()
  @IsDate()
  @FilterableField(() => GraphQLISODateTime)
  created!: Date;
}

import { ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BenefitDto } from './benefit.dto';

@ObjectType('BenefitsAndMembership')
export class BenefitsAndMembershipDto {
  @IsNotEmpty()
  @FilterableField(() => [BenefitDto])
  available: BenefitDto[];

  @IsNotEmpty()
  @FilterableField(() => [BenefitDto])
  unavailable: BenefitDto[];

  @IsNotEmpty()
  @FilterableField(() => [BenefitDto])
  used: BenefitDto[];

  @IsNotEmpty()
  @IsNumber()
  @FilterableField()
  membershipPoints!: number;
}
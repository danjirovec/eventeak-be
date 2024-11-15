import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { BenefitDto } from './benefit.dto/benefit.dto';
import { Benefit } from './benefit.entity/benefit.entity';
import { UserBenefit } from 'src/user.benefit/user.benefit.entity/user.benefit.entity';
import { UserBenefitDto } from 'src/user.benefit/user.benefit.dto/user.benefit.dto';
import { UserBenefitsDto } from './benefit.dto/user.benefits.dto';
import { BenefitQuery } from './types';

@Resolver(() => BenefitDto)
export class BenefitResolver {
  constructor(
    @InjectQueryService(Benefit)
    readonly benefitService: QueryService<BenefitDto>,
    @InjectQueryService(UserBenefit)
    readonly userBenefitSevice: QueryService<UserBenefitDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
  ) {}

  @Query(() => UserBenefitsDto)
  @UseGuards(AuthGuard)
  async getUserBenefits(
    @Args() query: BenefitQuery,
    @Args('meta') meta: string,
  ): Promise<UserBenefitsDto> {
    const membership = await this.membershipService.query({
      filter: {
        and: [query.filter, { userId: { eq: meta } }],
      },
      paging: { limit: 1 },
    });

    if (membership.length < 1) {
      return {
        membership: false,
        available: [],
        unavailable: [],
        used: [],
        membershipPoints: 0,
      };
    }

    const membershipPoints = membership[0].points;
    const membershipTypeId = membership[0].membershipTypeId;

    const benefits = await this.benefitService.query({
      filter: {
        and: [
          query.filter,
          {
            or: [
              { membershipTypeId: { eq: membershipTypeId } },
              { membershipTypeId: { is: null } },
            ],
          },
        ],
      },
    });

    const usedRaw = await this.userBenefitSevice.query({
      filter: {
        and: [query.filter, { userId: { eq: meta } }],
      },
    });
    const usedIds = usedRaw.map((item) => item.benefitId);
    const [usedNotFiltered, notUsedNotFiltered] = benefits.reduce<
      [typeof benefits, typeof benefits]
    >(
      (acc, current) => {
        if (usedIds.includes(current.id)) {
          acc[0].push(current);
        } else {
          acc[1].push(current);
        }
        return acc;
      },
      [[], []],
    );

    const date = new Date();
    const notUsed = notUsedNotFiltered.filter((item) => {
      return !item.expiryDate || item.expiryDate >= date;
    });
    date.setMonth(date.getMonth() - 1);
    const used = usedNotFiltered.filter((item) => item.created > date);

    const [available, unavailable] = notUsed.reduce<
      [typeof benefits, typeof benefits]
    >(
      (acc, current) => {
        if (current.points <= membershipPoints) {
          acc[0].push(current);
        } else {
          acc[1].push(current);
        }
        return acc;
      },
      [[], []],
    );

    return {
      membership: true,
      available: available,
      unavailable: unavailable,
      used: used,
      membershipPoints: membershipPoints,
    };
  }
}

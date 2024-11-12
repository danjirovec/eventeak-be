import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembershipState } from 'src/enum/enum';

@Resolver(() => MembershipDto)
export class MembershipResolver {
  constructor(
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: 'deleteMembership',
    timeZone: 'Europe/Prague',
  })
  async deleteMembership() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const memberships = await this.membershipService.query({
      filter: {
        and: [
          {
            expiryDate: {
              gte: startOfToday,
            },
          },
          { expiryDate: { lte: endOfToday } },
        ],
      },
    });

    const membershipIds = memberships.map((item) => item.id);
    if (membershipIds.length > 0) {
      await this.membershipService.deleteMany({ id: { in: membershipIds } });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'membershipRenewal',
    timeZone: 'Europe/Prague',
  })
  async membershipRenewal() {
    const today = new Date();
    const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));

    const memberships = await this.membershipService.query({
      filter: {
        and: [
          {
            expiryDate: {
              lt: oneMonthFromNow,
            },
          },
          { state: { eq: MembershipState.Active } },
        ],
      },
    });

    const membershipIds = memberships.map((item) => item.id);

    if (membershipIds.length > 0) {
      await this.membershipService.updateMany(
        { state: MembershipState.Renewal },
        { id: { in: membershipIds } },
      );
    }
  }
}

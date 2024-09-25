import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDto } from './user.dto/user.dto';
import { UpdateUserPasswordDto } from './user.dto/user.update.password.dto';
import { supabaseAdmin } from 'src/utils/supabaseAdmin';
import { UserQuery } from './types';
import { UserProfileDto } from './user.dto/user.profile.dto';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { User } from './user.entity/user.entity';
import { UserBenefit } from 'src/user.benefit/user.benefit.entity/user.benefit.entity';
import { UserBenefitDto } from 'src/user.benefit/user.benefit.dto/user.benefit.dto';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { filter } from 'rxjs';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { TicketAggDto } from 'src/ticket/ticket.dto/ticket.user.dto';

const groupBy = (arr: TicketDto[]): TicketAggDto[] => {
  const grouped = arr.reduce((result: TicketAggDto, currentItem: TicketDto) => {
    const { eventId } = currentItem;
    if (!result[eventId]) {
      result[eventId] = [];
    }
    result[eventId].push(currentItem);
    return result;
  }, {} as TicketAggDto);

  return Object.entries(grouped).map(([eventId, tickets]) => ({
    id: eventId,
    ticketSet: tickets,
  }));
};

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(UserBenefit)
    readonly userBenefitService: QueryService<UserBenefitDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
  ) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async updateUserPassword(@Args('input') input: UpdateUserPasswordDto) {
    let userId = null;
    try {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        input.userId,
        {
          password: input.password,
        },
      );
      userId = data.user.id;
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
    return userId;
  }

  @Query(() => UserProfileDto)
  @UseGuards(AuthGuard)
  async profile(
    @Args() query: UserQuery,
    @Args('meta') meta: string,
  ): Promise<UserProfileDto> {
    const user = await this.userService.getById(query.filter.id.eq);

    const membership = await this.membershipService.query({
      filter: {
        and: [{ userId: { eq: user.id } }, { businessId: { eq: meta } }],
      },
      paging: { limit: 1 },
    });

    const membershipPoints = membership[0].points;

    const eventsAttended = await this.ticketService.query({
      filter: {
        and: [
          { userId: { eq: user.id } },
          { businessId: { eq: meta } },
          { validated: { is: true } },
        ],
      },
    });

    const eventsAttendedCount = groupBy(eventsAttended).length;

    const benefitsUsed = await this.userBenefitService.count({
      and: [{ userId: { eq: user.id } }, { businessId: { eq: meta } }],
    });

    return {
      ...user,
      membershipPoints: membershipPoints,
      benefitsUsed: benefitsUsed,
      eventsVisited: eventsAttendedCount,
    };
  }
}

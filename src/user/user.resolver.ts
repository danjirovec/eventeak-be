import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDto } from './user.dto/user.dto';
import { UpdatePasswordDto } from './user.dto/user.update.password.dto';
import { supabaseAdmin } from 'src/utils/supabaseAdmin';
import { UserQuery } from './types';
import { UserProfileDto } from './user.dto/user.profile.dto';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { User } from './user.entity/user.entity';
import { UserBenefit } from 'src/user.benefit/user.benefit.entity/user.benefit.entity';
import { UserBenefitDto } from 'src/user.benefit/user.benefit.dto/user.benefit.dto';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { AnonymizeUserDto } from './user.dto/user.anonymize.dto';
import { OrderDto } from 'src/order/order.dto/order.dto';
import { Order } from 'src/order/order.entity/order.entity';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';
import { anonymize } from 'src/utils/anonymize';
import { groupBy } from 'src/utils/groupBy';
import { BatchUserEmailDto } from './user.dto/user.batch.email.dto';
import { UserEmailDto } from './user.dto/user.email.dto';
import { MailService } from 'src/mail/mail.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(UserBenefit)
    readonly userBenefitService: QueryService<UserBenefitDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
    @InjectQueryService(Order)
    readonly orderService: QueryService<OrderDto>,
    readonly mailService: MailService,
  ) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async updatePassword(@Args('input') input: UpdatePasswordDto) {
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
        throw new BadRequestException(error);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
    return userId;
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async anonymizeUser(@Args('input') input: AnonymizeUserDto) {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(input.userId);
      if (error) {
        throw new BadRequestException(error);
      }
      await this.userService.updateOne(input.userId, anonymize());
      const filter = {
        and: [
          { userId: { eq: input.userId } },
          { businessId: { eq: input.businessId } },
        ],
      };
      await this.membershipService.deleteMany(filter);
      await this.userBenefitService.deleteMany(filter);
      await this.businessUserService.deleteMany(filter);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
    return input.userId;
  }

  @Query(() => UserProfileDto)
  @UseGuards(AuthGuard)
  async profileInfo(
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

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async sendEmail(@Args('input') input: BatchUserEmailDto) {
    try {
      await this.mailService.sendBatchUserEmail(
        input.subject,
        input.emails,
        input.message,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
    return true;
  }
}

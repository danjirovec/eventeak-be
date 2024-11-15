import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembershipState } from 'src/enum/enum';
// import { CreateMembershipDto } from './membership.dto/membership.create.dto';
// import { BadRequestException, UseGuards } from '@nestjs/common';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { DataSource } from 'typeorm';
// import { Order } from 'src/order/order.entity/order.entity';
// import { OrderDto } from 'src/order/order.dto/order.dto';
import { MailService } from 'src/mail/mail.service';
// import { User } from 'src/user/user.entity/user.entity';
// import { UserDto } from 'src/user/user.dto/user.dto';
// import { Business } from 'src/business/business.entity/business.entity';
// import { BusinessDto } from 'src/business/business.dto/business.dto';
// import { MembershipTypeDto } from 'src/membership.type/membership.type.dto/membership.type.dto';
// import { MembershipType } from 'src/membership.type/membership.type.entity/membership.type.entity';

@Resolver(() => MembershipDto)
export class MembershipResolver {
  constructor(
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    readonly mailService: MailService,
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

  // @Mutation(() => MembershipDto)
  // @UseGuards(AuthGuard)
  // async createMembership(@Args('input') input: CreateMembershipDto) {
  //   let membership;
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const { order, ...rest } = input;
  //     await this.orderService.createOne({
  //       userId: order.userId,
  //       total: order.total,
  //       businessId: order.businessId,
  //       paymentId: order.paymentId,
  //       paymentType: order.paymentType,
  //     });

  //     membership = await this.membershipService.createOne(rest);

  //     if (order.userId) {
  //       const user = await this.userService.getById(input.order.userId);
  //       const business = await this.businessService.getById(
  //         input.order.businessId,
  //       );
  //       const membershipType = await this.membershipTypeService.getById(
  //         membership.membershipTypeId,
  //       );
  //       await this.mailService.sendMembership(
  //         user,
  //         business,
  //         membership,
  //         membershipType,
  //       );
  //     }
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     console.log(err);
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException(err);
  //   } finally {
  //     await queryRunner.release();
  //   }
  //   return membership;
  // }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DataSource } from 'typeorm';
import { BusinessDto } from './business.dto/business.dto';
import { CreateBusinessDto } from './business.dto/business.create.dto';
import { Business } from './business.entity/business.entity';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { Role } from 'src/enum/enum';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { BusinessConnection, BusinessQuery } from './types';
import { ConnectionType } from '@ptc-org/nestjs-query-graphql';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';
import { BusinessMetricsDto } from './business.dto/business.metrics.dto';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { User } from 'src/user/user.entity/user.entity';
import { UserDto } from 'src/user/user.dto/user.dto';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { EventDto } from 'src/event/event.dto/event.dto';
import { Ticket } from 'src/ticket/ticket.entity/ticket.entity';
import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';

@Resolver(() => BusinessDto)
export class BusinessResolver {
  constructor(
    @InjectQueryService(Business)
    readonly businessService: QueryService<BusinessDto>,
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    @InjectQueryService(Ticket)
    readonly ticketService: QueryService<TicketDto>,
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => BusinessDto)
  @UseGuards(AuthGuard)
  async createBusiness(@Args('input') input: CreateBusinessDto) {
    let newBusiness = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newBusiness = await this.businessService.createOne(input);
      await this.businessUserService.createOne({
        businessId: newBusiness.id,
        userId: input.userId,
        role: Role.Admin,
      });
      const user = await this.userService.getById(input.userId);
      if (!user.defaultBusinessId) {
        await this.userService.updateOne(user.id, {
          defaultBusinessId: newBusiness.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newBusiness;
  }

  @Query(() => BusinessConnection)
  @UseGuards(AuthGuard)
  async getUserBusinesses(
    @Args() query: BusinessQuery,
    @Args('meta') meta: string,
  ): Promise<ConnectionType<BusinessDto>> {
    const metaParsed = JSON.parse(meta);
    const businessUsers = await this.businessUserService.query({
      filter: {
        and: [
          { userId: { eq: metaParsed.user } },
          { role: { eq: Role.Admin } },
        ],
      },
    });
    const businessIds = businessUsers.map((user) => user.businessId);

    if (businessIds.length === 0) {
      return new BusinessConnection();
    }

    return BusinessConnection.createFromPromise(
      (q) =>
        this.businessService.query({
          filter: { and: [{ id: { in: businessIds } }, query.filter] },
          sorting: query.sorting,
          paging: query.paging,
        }),
      query,
    );
  }

  @Query(() => BusinessMetricsDto)
  @UseGuards(AuthGuard)
  async getBusinessMetrics(
    @Args('meta') meta: string,
  ): Promise<BusinessMetricsDto> {
    const metaParsed = JSON.parse(meta);
    const counts = { events: [], memberships: [], customers: [], tickets: [] };
    const businessId = metaParsed.businessId;

    const getDateDaysAgo = (daysAgo: number = 0) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date;
    };
    const dates = Array.from({ length: 10 }, (_, i) =>
      i === 0 ? new Date() : getDateDaysAgo(i * 2),
    );

    for (const date of dates) {
      const eventCount = await this.eventService.count({
        and: [{ created: { lte: date } }, { businessId: { eq: businessId } }],
      });
      counts.events.push(eventCount);
      const memCount = await this.membershipService.count({
        and: [{ created: { lte: date } }, { businessId: { eq: businessId } }],
      });
      counts.memberships.push(memCount);
      const custCount = await this.businessUserService.count({
        and: [{ created: { lte: date } }, { businessId: { eq: businessId } }],
      });
      counts.customers.push(custCount);
      const ticketCount = await this.ticketService.count({
        and: [{ created: { lte: date } }, { businessId: { eq: businessId } }],
      });
      counts.tickets.push(ticketCount);
    }
    return counts;
  }
}

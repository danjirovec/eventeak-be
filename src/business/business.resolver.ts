import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DataSource, Filter } from 'typeorm';
import { BusinessDto } from './business.dto/business.dto';
import { CreateBusinessDto } from './business.dto/business.create.dto';
import { Business } from './business.entity/business.entity';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { Role } from 'src/enum/enum';
import { randomBytes } from 'crypto';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { BusinessConnection, BusinessQuery } from './types';
import { ConnectionType } from '@ptc-org/nestjs-query-graphql';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';
import { CountsBusinessDto } from './business.dto/business.counts.dto';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { User } from 'src/user/user.entity/user.entity';
import { UserDto } from 'src/user/user.dto/user.dto';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { EventDto } from 'src/event/event.dto/event.dto';

@Resolver(() => BusinessDto)
export class BusinessResolver {
  constructor(
    @InjectQueryService(Business)
    readonly businessService: QueryService<BusinessDto>,
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => BusinessDto)
  @UseGuards(AuthGuard)
  async createBusinessAndBusinessUserAdmin(
    @Args('input') input: CreateBusinessDto,
  ) {
    let newBusiness = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newBusiness = queryRunner.manager.create(Business, {
        ...input,
        apiKey: randomBytes(32).toString('hex'),
      });
      await queryRunner.manager.save(newBusiness);

      const newBusinessUserAdmin = queryRunner.manager.create(BusinessUser, {
        businessId: newBusiness.id,
        userId: input.userId,
        role: Role.Admin,
      });
      await queryRunner.manager.save(newBusinessUserAdmin);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return newBusiness;
  }

  @Query(() => BusinessConnection)
  @UseGuards(AuthGuard)
  async userBusinesses(
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

  @Query(() => CountsBusinessDto)
  @UseGuards(AuthGuard)
  async businessCounts(
    @Args('meta', { nullable: true }) meta?: string,
  ): Promise<CountsBusinessDto> {
    const metaParsed = JSON.parse(meta);
    const counts = { events: [], memberships: [], customers: [] };
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
    }
    return counts;
  }
}
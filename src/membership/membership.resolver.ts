import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Membership } from 'src/membership/membership.entity/membership.entity';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { UserMembershipConnection, UserMembershipQuery } from './types';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ConnectionType } from '@ptc-org/nestjs-query-graphql';
import { UserMembershipDto } from './membership.dto/user.membership.dto';
import { User } from 'src/user/user.entity/user.entity';
import { UserDto } from 'src/user/user.dto/user.dto';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';

@Resolver(() => MembershipDto)
export class MembershipResolver {
  constructor(
    @InjectQueryService(Membership)
    readonly membershipService: QueryService<MembershipDto>,
    // @InjectQueryService(BusinessUser)
    // readonly businessUserService: QueryService<BusinessUserDto>,
  ) {}

  // @Query(() => UserMembershipConnection)
  // @UseGuards(AuthGuard)
  // async getBusinessUsers(
  //   @Args() query: UserMembershipQuery,
  //   @Args('meta') meta: string,
  // ): Promise<ConnectionType<UserMembershipDto>> {
  //   const metaParsed = JSON.parse(meta);
  //   const businessUsers = await this.businessUserService.query({
  //     filter: {
  //       and: [{ businessId: { eq: metaParsed.user } }],
  //     },
  //   });
  //   const userIds = businessUsers.map((item) => item.userId);

  //   if (userIds.length === 0) {
  //     return new UserMembershipConnection();
  //   }

  //   return UserMembershipConnection.createFromPromise(
  //     (q) =>
  //       this.membershipService.query({
  //         filter: { and: [{ id: { in: businessIds } }, query.filter] },
  //         sorting: query.sorting,
  //         paging: query.paging,
  //       }),
  //     query,
  //   );
  // }
}

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateMembershipDto } from './membership.dto/membership.create.dto';
import { MembershipDto } from './membership.dto/membership.dto';
import { Membership } from './membership.entity/membership.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { MembershipResolver } from './membership.resolver';

@Module({
  providers: [MembershipResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Membership]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Membership]), JwtModule],
      resolvers: [
        {
          EntityClass: Membership,
          DTOClass: MembershipDto,
          CreateDTOClass: CreateMembershipDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Membership])],
})
export class MembershipModule {}

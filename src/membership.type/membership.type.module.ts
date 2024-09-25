import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateMembershipTypeDto } from './membership.type.dto/membership.type.create.dto';
import { MembershipTypeDto } from './membership.type.dto/membership.type.dto';
import { MembershipType } from './membership.type.entity/membership.type.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([MembershipType]),
        JwtModule,
      ],
      resolvers: [
        {
          EntityClass: MembershipType,
          DTOClass: MembershipTypeDto,
          CreateDTOClass: CreateMembershipTypeDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class MembershipTypeModule {}

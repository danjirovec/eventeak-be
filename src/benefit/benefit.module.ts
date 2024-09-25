import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateBenefitDto } from './benefit.dto/benefit.create.dto';
import { BenefitDto } from './benefit.dto/benefit.dto';
import { Benefit } from './benefit.entity/benefit.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { MembershipModule } from 'src/membership/membership.module';
import { UserBenefitModule } from 'src/user.benefit/user.benefit.module';
import { BenefitResolver } from './benefit.resolver';
import { UpdateBenefitDto } from './benefit.dto/benefit.update.dto';

@Module({
  providers: [BenefitResolver],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Benefit]),
        JwtModule,
        MembershipModule,
        UserBenefitModule,
      ],
      resolvers: [
        {
          EntityClass: Benefit,
          DTOClass: BenefitDto,
          CreateDTOClass: CreateBenefitDto,
          UpdateDTOClass: UpdateBenefitDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class BenefitModule {}

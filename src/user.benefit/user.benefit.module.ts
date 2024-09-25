import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateUserBenefitDto } from './user.benefit.dto/user.benefit.create.dto';
import { UserBenefitDto } from './user.benefit.dto/user.benefit.dto';
import { UserBenefit } from './user.benefit.entity/user.benefit.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserBenefitResolver } from './user.benefit.resolver';

@Module({
  providers: [UserBenefitResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([UserBenefit]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserBenefit]), JwtModule],
      resolvers: [
        {
          EntityClass: UserBenefit,
          DTOClass: UserBenefitDto,
          CreateDTOClass: CreateUserBenefitDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([UserBenefit])],
})
export class UserBenefitModule {}

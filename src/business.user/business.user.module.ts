import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateBusinessUserDto } from './business.user.dto/business.user.create.dto';
import { BusinessUserDto } from './business.user.dto/business.user.dto';
import { BusinessUser } from './business.user.entity/business.user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { BusinessUserResolver } from './business.user.resolver';

@Module({
  providers: [BusinessUserResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([BusinessUser]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([BusinessUser]), JwtModule],
      resolvers: [
        {
          EntityClass: BusinessUser,
          DTOClass: BusinessUserDto,
          CreateDTOClass: CreateBusinessUserDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([BusinessUser])],
})
export class BusinessUserModule {}

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateSeatDto } from './seat.dto/seat.create.dto';
import { SeatDto } from './seat.dto/seat.dto';
import { Seat } from './seat.entity/seat.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SeatResolver } from './seat.resolver';

@Module({
  providers: [SeatResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Seat]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Seat]), JwtModule],
      resolvers: [
        {
          EntityClass: Seat,
          DTOClass: SeatDto,
          CreateDTOClass: CreateSeatDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Seat])],
})
export class SeatModule {}

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { EventDiscount } from './event.discount.entity/event.discount.entity';
import { EventDiscountDto } from './event.discount.dto/event.discount.dto';
import { CreateEventDiscountDto } from './event.discount.dto/event.discount.create.dto';

@Module({
  providers: [],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([EventDiscount]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([EventDiscount]),
        JwtModule,
      ],
      resolvers: [
        {
          EntityClass: EventDiscount,
          DTOClass: EventDiscountDto,
          CreateDTOClass: CreateEventDiscountDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([EventDiscount])],
})
export class EventDiscountModule {}

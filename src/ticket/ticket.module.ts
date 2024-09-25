import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateTicketDto } from './ticket.dto/ticket.create.dto';
import { TicketDto } from './ticket.dto/ticket.dto';
import { Ticket } from './ticket.entity/ticket.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TicketResolver } from './ticket.resolver';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [TicketResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Ticket]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Ticket]),
        JwtModule,
        OrderModule,
      ],
      resolvers: [
        {
          EntityClass: Ticket,
          DTOClass: TicketDto,
          CreateDTOClass: CreateTicketDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          enableAggregate: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Ticket])],
})
export class TicketModule {}

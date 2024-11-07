import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateOrderDto } from './order.dto/order.create.dto';
import { OrderDto } from './order.dto/order.dto';
import { Order } from './order.entity/order.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { OrderResolver } from './order.resolver';
import { UpdateOrderDto } from './order.dto/order.update.dto';

@Module({
  providers: [OrderResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Order]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Order]), JwtModule],
      resolvers: [
        {
          EntityClass: Order,
          DTOClass: OrderDto,
          CreateDTOClass: CreateOrderDto,
          UpdateDTOClass: UpdateOrderDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Order])],
})
export class OrderModule {}

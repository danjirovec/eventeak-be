import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { Discount } from './discount.entity/discount.entity';
import { DiscountDto } from './discount.dto/discount.dto';
import { CreateDiscountDto } from './discount.dto/discount.create.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { DiscountResolver } from './discount.resolver';
import { UpdateDiscountDto } from './discount.dto/discount.update.dto';

@Module({
  providers: [DiscountResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Discount]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Discount]), JwtModule],
      resolvers: [
        {
          EntityClass: Discount,
          DTOClass: DiscountDto,
          CreateDTOClass: CreateDiscountDto,
          UpdateDTOClass: UpdateDiscountDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Discount])],
})
export class DiscountModule {}

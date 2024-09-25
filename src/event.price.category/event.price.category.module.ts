import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateEventPriceCategoryDto } from './event.price.category.dto/event.price.category.create.dto';
import { EventPriceCategoryDto } from './event.price.category.dto/event.price.category.dto';
import { EventPriceCategory } from './event.price.category.entity/event.price.category.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UpdateEventPriceCategoryDto } from './event.price.category.dto/event.price.category.update.dto';
import { EventPriceCategoryResolver } from './event.price.category.resolver';
import { TicketModule } from 'src/ticket/ticket.module';
import { SectionModule } from 'src/section/section.module';

@Module({
  providers: [EventPriceCategoryResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([EventPriceCategory]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([EventPriceCategory]),
        JwtModule,
        TicketModule,
        SectionModule,
      ],
      resolvers: [
        {
          EntityClass: EventPriceCategory,
          DTOClass: EventPriceCategoryDto,
          CreateDTOClass: CreateEventPriceCategoryDto,
          UpdateDTOClass: UpdateEventPriceCategoryDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([EventPriceCategory])],
})
export class EventPriceCategoryModule {}

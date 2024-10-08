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
import { EventPriceCategoryService } from './event.price.category.service';
import { EventModule } from 'src/event/event.module';

@Module({
  providers: [EventPriceCategoryResolver, EventPriceCategoryService],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([EventPriceCategory]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([EventPriceCategory]),
        JwtModule,
        TicketModule,
        SectionModule,
      ],
      services: [EventPriceCategoryService],
      resolvers: [
        {
          EntityClass: EventPriceCategory,
          DTOClass: EventPriceCategoryDto,
          CreateDTOClass: CreateEventPriceCategoryDto,
          UpdateDTOClass: UpdateEventPriceCategoryDto,
          ServiceClass: EventPriceCategoryService,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [
    NestjsQueryTypeOrmModule.forFeature([EventPriceCategory]),
    EventPriceCategoryService,
  ],
})
export class EventPriceCategoryModule {}

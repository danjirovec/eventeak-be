import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateEventDto } from './event.dto/event.create.dto';
import { EventDto } from './event.dto/event.dto';
import { Event } from './event.entity/event.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UpdateEventDto } from './event.dto/event.update.dto';
import { EventResolver } from './event.resolver';
import { EventPriceCategoryModule } from 'src/event.price.category/event.price.category.module';
import { EventTemplateModule } from 'src/event.template/event.template.module';
import { VenueModule } from 'src/venue/venue.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { SeatModule } from 'src/seat/seat.module';
import { SectionModule } from 'src/section/section.module';

@Module({
  providers: [EventResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Event]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Event]),
        JwtModule,
        EventPriceCategoryModule,
        EventTemplateModule,
        VenueModule,
        TicketModule,
        SeatModule,
        SectionModule,
      ],
      resolvers: [
        {
          EntityClass: Event,
          DTOClass: EventDto,
          CreateDTOClass: CreateEventDto,
          UpdateDTOClass: UpdateEventDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Event])],
})
export class EventModule {}

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateEventTemplateDto } from './event.template.dto/event.template.create.dto';
import { EventTemplateDto } from './event.template.dto/event.template.dto';
import { EventTemplate } from './event.template.entity/event.template.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UpdateEventTemplateDto } from './event.template.dto/event.template.update.dto';
import { EventTemplateResolver } from './event.template.resolver';
import { EventPriceCategoryModule } from 'src/event.price.category/event.price.category.module';
import { EventPriceCategoryResolver } from 'src/event.price.category/event.price.category.resolver';
import { TicketModule } from 'src/ticket/ticket.module';
import { SectionModule } from 'src/section/section.module';

@Module({
  providers: [EventTemplateResolver, EventPriceCategoryResolver],
  imports: [
    EventPriceCategoryModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([EventTemplate]),
        JwtModule,
        EventPriceCategoryModule,
        TicketModule,
        SectionModule,
      ],
      resolvers: [
        {
          EntityClass: EventTemplate,
          DTOClass: EventTemplateDto,
          CreateDTOClass: CreateEventTemplateDto,
          UpdateDTOClass: UpdateEventTemplateDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
    NestjsQueryTypeOrmModule.forFeature([EventTemplate]),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([EventTemplate])],
})
export class EventTemplateModule {}

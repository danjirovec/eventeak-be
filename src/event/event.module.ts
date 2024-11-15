import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CreateEventDto } from './event.dto/event.create.dto';
import { EventDto } from './event.dto/event.dto';
import { Event } from './event.entity/event.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UpdateEventDto } from './event.dto/event.update.dto';
import { EventResolver } from './event.resolver';
import { PriceCategoryModule } from 'src/price.category/price.category.module';
import { TemplateModule } from 'src/template/template.module';
import { VenueModule } from 'src/venue/venue.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { SeatModule } from 'src/seat/seat.module';
import { SectionModule } from 'src/section/section.module';
import { UserModule } from 'src/user/user.module';
import { BusinessUserModule } from 'src/business.user/business.user.module';
import { DiscountModule } from 'src/discount/discount.module';
import { OrderModule } from 'src/order/order.module';
import { PriceCategoryService } from 'src/price.category/price.category.service';
import { TemplateDiscountModule } from 'src/template.discount/template.discount.module';
import { MailModule } from 'src/mail/mail.module';
import { BusinessModule } from 'src/business/business.module';
import { MembershipModule } from 'src/membership/membership.module';
import { MembershipTypeModule } from 'src/membership.type/membership.type.module';

@Module({
  providers: [EventResolver, PriceCategoryService],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Event]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Event]),
        JwtModule,
        PriceCategoryModule,
        TemplateModule,
        forwardRef(() => MembershipModule),
        MembershipTypeModule,
        VenueModule,
        TicketModule,
        SeatModule,
        SectionModule,
        forwardRef(() => UserModule),
        forwardRef(() => BusinessModule),
        BusinessUserModule,
        DiscountModule,
        TemplateDiscountModule,
        OrderModule,
        MailModule,
        forwardRef(() => BusinessModule),
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

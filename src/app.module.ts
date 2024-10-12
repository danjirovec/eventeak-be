import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EventModule } from './event/event.module';
import { EventTemplateModule } from './event.template/event.template.module';
import { VenueModule } from './venue/venue.module';
import { MembershipModule } from './membership/membership.module';
import { BenefitModule } from './benefit/benefit.module';
import { SeatModule } from './seat/seat.module';
import { UserBenefitModule } from './user.benefit/user.benefit.module';
import { BusinessModule } from './business/business.module';
import { TicketModule } from './ticket/ticket.module';
import { OrderModule } from './order/order.module';
import { MembershipTypeModule } from './membership.type/membership.type.module';
import { SectionModule } from './section/section.module';
import { BusinessUserModule } from './business.user/business.user.module';
import { DiscountModule } from './discount/discount.module';
import { MailModule } from './mail/mail.module';
import { EventDiscountModule } from './event.discount/event.discount.module';
import { RowModule } from './row/row.module';
import { PriceCategoryModule } from './price.category/price.category.module';
import { EventPrice } from './event.price/event.price.entity/event.price.category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: true, // set to false in prod
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    EventModule,
    EventTemplateModule,
    VenueModule,
    MembershipModule,
    BenefitModule,
    SeatModule,
    RowModule,
    UserBenefitModule,
    TicketModule,
    OrderModule,
    MembershipTypeModule,
    SectionModule,
    PriceCategoryModule,
    BusinessModule,
    BusinessUserModule,
    DiscountModule,
    EventDiscountModule,
    EventPrice,
    MailModule,
  ],
})
export class AppModule {}

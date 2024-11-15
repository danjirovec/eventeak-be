import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CreateBusinessDto } from './business.dto/business.create.dto';
import { BusinessDto } from './business.dto/business.dto';
import { Business } from './business.entity/business.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { BusinessResolver } from './business.resolver';
import { BusinessUserModule } from 'src/business.user/business.user.module';
import { EventModule } from 'src/event/event.module';
import { MembershipModule } from 'src/membership/membership.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessResolver, BusinessService],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Business]),
        JwtModule,
        BusinessUserModule,
        forwardRef(() => EventModule),
        forwardRef(() => MembershipModule),
        forwardRef(() => UserModule),
        MailModule,
        TicketModule,
      ],
      resolvers: [
        {
          EntityClass: Business,
          DTOClass: BusinessDto,
          CreateDTOClass: CreateBusinessDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
    NestjsQueryTypeOrmModule.forFeature([Business]),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Business])],
})
export class BusinessModule {}

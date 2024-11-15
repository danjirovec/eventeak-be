import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CreateUserDto } from './user.dto/user.create.dto';
import { UserDto } from './user.dto/user.dto';
import { User } from './user.entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './user.dto/user.update.dto';
import { UserResolver } from './user.resolver';
import { MembershipModule } from 'src/membership/membership.module';
import { UserBenefitModule } from 'src/user.benefit/user.benefit.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { OrderModule } from 'src/order/order.module';
import { BusinessUserModule } from 'src/business.user/business.user.module';
import { MailModule } from 'src/mail/mail.module';
import { MembershipTypeModule } from 'src/membership.type/membership.type.module';

@Module({
  providers: [UserResolver],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([User]),
        JwtModule,
        MembershipModule,
        MembershipTypeModule,
        UserBenefitModule,
        TicketModule,
        OrderModule,
        BusinessUserModule,
        MailModule,
      ],
      resolvers: [
        {
          EntityClass: User,
          DTOClass: UserDto,
          CreateDTOClass: CreateUserDto,
          UpdateDTOClass: UpdateUserDto,
          enableSubscriptions: true,
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [AuthGuard],
        },
      ],
    }),
    NestjsQueryTypeOrmModule.forFeature([User]),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([User])],
})
export class UserModule {}

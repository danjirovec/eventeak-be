import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PriceCategoryResolver } from './price.category.resolver';
import { TicketModule } from 'src/ticket/ticket.module';
import { SectionModule } from 'src/section/section.module';
import { PriceCategoryService } from './price.category.service';
import { PriceCategory } from './price.category.entity/price.category.entity';
import { PriceCategoryDto } from './price.category.dto/price.category.dto';
import { UpdatePriceCategoryDto } from './price.category.dto/price.category.update.dto';
import { CreatePriceCategoryDto } from './price.category.dto/price.category.create.dto';

@Module({
  providers: [PriceCategoryResolver, PriceCategoryService],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([PriceCategory]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([PriceCategory]),
        JwtModule,
        TicketModule,
        SectionModule,
      ],
      services: [PriceCategoryService],
      resolvers: [
        {
          EntityClass: PriceCategory,
          DTOClass: PriceCategoryDto,
          CreateDTOClass: CreatePriceCategoryDto,
          UpdateDTOClass: UpdatePriceCategoryDto,
          ServiceClass: PriceCategoryService,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [
    NestjsQueryTypeOrmModule.forFeature([PriceCategory]),
    PriceCategoryService,
  ],
})
export class PriceCategoryModule {}

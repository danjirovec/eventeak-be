import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateTemplateDto } from './template.dto/template.create.dto';
import { TemplateDto } from './template.dto/template.dto';
import { Template } from './template.entity/template.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UpdateTemplateDto } from './template.dto/template.update.dto';
import { TemplateResolver } from './template.resolver';
import { PriceCategoryModule } from 'src/price.category/price.category.module';
import { PriceCategoryResolver } from 'src/price.category/price.category.resolver';
import { TicketModule } from 'src/ticket/ticket.module';
import { SectionModule } from 'src/section/section.module';
import { DiscountModule } from 'src/discount/discount.module';
import { TemplateDiscountModule } from 'src/template.discount/template.discount.module';

@Module({
  providers: [TemplateResolver, PriceCategoryResolver],
  imports: [
    PriceCategoryModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Template]),
        JwtModule,
        PriceCategoryModule,
        TicketModule,
        SectionModule,
        TemplateDiscountModule,
      ],
      resolvers: [
        {
          EntityClass: Template,
          DTOClass: TemplateDto,
          CreateDTOClass: CreateTemplateDto,
          UpdateDTOClass: UpdateTemplateDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
    NestjsQueryTypeOrmModule.forFeature([Template]),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Template])],
})
export class TemplateModule {}

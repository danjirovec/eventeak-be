import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TemplateDiscount } from './template.discount.entity/template.discount.entity';
import { TemplateDiscountDto } from './template.discount.dto/template.discount.dto';
import { CreateTemplateDiscountDto } from './template.discount.dto/template.discount.create.dto';

@Module({
  providers: [],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([TemplateDiscount]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([TemplateDiscount]),
        JwtModule,
      ],
      resolvers: [
        {
          EntityClass: TemplateDiscount,
          DTOClass: TemplateDiscountDto,
          CreateDTOClass: CreateTemplateDiscountDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([TemplateDiscount])],
})
export class TemplateDiscountModule {}

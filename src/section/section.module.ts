import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateSectionDto } from './section.dto/section.create.dto';
import { SectionDto } from './section.dto/section.dto';
import { Section } from './section.entity/section.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { SectionResolver } from './section.resolver';

@Module({
  providers: [SectionResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Section]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Section]), JwtModule],
      resolvers: [
        {
          EntityClass: Section,
          DTOClass: SectionDto,
          CreateDTOClass: CreateSectionDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Section])],
})
export class SectionModule {}

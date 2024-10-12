import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { Row } from './row.entity/row.entity';
import { RowDto } from './row.dto/row.dto';
import { CreateRowDto } from './row.dto/row.create.dto';
import { RowResolver } from './row.resolver';

@Module({
  providers: [RowResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Row]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Row]), JwtModule],
      resolvers: [
        {
          EntityClass: Row,
          DTOClass: RowDto,
          CreateDTOClass: CreateRowDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Row])],
})
export class RowModule {}

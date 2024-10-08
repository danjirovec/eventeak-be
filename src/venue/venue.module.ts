import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateVenueDto } from './venue.dto/venue.create.dto';
import { VenueDto } from './venue.dto/venue.dto';
import { Venue } from './venue.entity/venue.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { SeatModule } from 'src/seat/seat.module';
import { VenueResolver } from './venue.resolver';
import { SectionModule } from 'src/section/section.module';
import { EventPriceCategoryModule } from 'src/event.price.category/event.price.category.module';

@Module({
  providers: [VenueResolver],
  imports: [
    NestjsQueryTypeOrmModule.forFeature([Venue]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Venue]),
        JwtModule,
        SeatModule,
        SectionModule,
      ],
      resolvers: [
        {
          EntityClass: Venue,
          DTOClass: VenueDto,
          CreateDTOClass: CreateVenueDto,
          enableSubscriptions: true,
          guards: [AuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
      dtos: [{ DTOClass: VenueDto, CreateDTOClass: CreateVenueDto }],
    }),
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([Venue])],
})
export class VenueModule {}

import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { VenueDto } from './venue.dto/venue.dto';
import { Venue } from './venue.entity/venue.entity';
import { Seat } from 'src/seat/seat.entity/seat.entity';
import { SeatDto } from 'src/seat/seat.dto/seat.dto';
import { CreateVenueDto } from './venue.dto/venue.create.dto';
import { DataSource } from 'typeorm';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { Section } from 'src/section/section.entity/section.entity';
import { transformVenueData } from 'src/utils/transformVenueData';
import { PriceCategory } from 'src/price.category/price.category.entity/price.category.entity';
import { PriceCategoryDto } from 'src/price.category/price.category.dto/price.category.dto';

@Resolver(() => VenueDto)
export class VenueResolver {
  constructor(
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
    @InjectQueryService(Seat)
    readonly seatService: QueryService<SeatDto>,
    @InjectQueryService(Section)
    readonly sectionService: QueryService<SectionDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => VenueDto)
  @UseGuards(AuthGuard)
  async createVenue(@Args('input') input: CreateVenueDto) {
    let venue;
    const sections = [];
    const seats = [];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (input.hasSeats) {
        const venueData = transformVenueData(input.data);
        venue = await this.venueService.createOne({
          ...input,
          data: venueData,
        });

        for (const section of venueData.categories) {
          sections.push({ name: section[0], venueId: venue.id });
        }
        const newSections = await this.sectionService.createMany(sections);

        for (const row in venueData.rows) {
          const section = newSections.find(
            (item) => item.name == (venueData.rows[row].category as string),
          );
          venueData.rows[row].seats.map((seat, index) => {
            venueData.rows[row].seats[index].sectionId = section.id;
            seats.push({
              row: venueData.rows[row].label,
              seat: seat.number,
              sectionId: section.id,
            });
          });
        }
        const newSeats = await this.seatService.createMany(seats);
        for (const row in venueData.rows) {
          venueData.rows[row].seats.map((seat, index) => {
            venueData.rows[row].seats[index].seatId = newSeats[index].id;
          });
        }
        const { id, ...rest } = venue;
        await this.venueService.updateOne(id, {
          ...rest,
          data: venueData,
        });
      } else {
        venue = await this.venueService.createOne({ ...input });
        if (!input.sections || !input.sections.length) {
          sections.push({
            name: 'None',
            capacity: venue.capacity,
            venueId: venue.id,
          });
        } else {
          for (const section of input.sections) {
            sections.push({
              name: section.name,
              capacity: section.capacity,
              venueId: venue.id,
            });
          }
        }
        await this.sectionService.createMany(sections);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return venue;
  }
}

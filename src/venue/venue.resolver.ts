import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { VenueDto } from './venue.dto/venue.dto';
import { Venue } from './venue.entity/venue.entity';
import { Seat } from 'src/seat/seat.entity/seat.entity';
import { SeatDto } from 'src/seat/seat.dto/seat.dto';
import { CreateVenueDto } from './venue.dto/venue.create.dto';
import { DataSource } from 'typeorm';
import { SectionDto } from 'src/section/section.dto/section.dto';
import { Section } from 'src/section/section.entity/section.entity';

@Resolver(() => VenueDto)
export class VenueResolver {
  constructor(
    @InjectQueryService(Venue)
    readonly venuesService: QueryService<VenueDto>,
    @InjectQueryService(Seat)
    readonly seatsService: QueryService<SeatDto>,
    @InjectQueryService(Section)
    readonly sectionsService: QueryService<SectionDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => VenueDto)
  @UseGuards(AuthGuard)
  async createVenueWithSeats(@Args('input') input: CreateVenueDto) {
    let venue;
    const sections = [];
    const seats = [];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (input.hasSeats) {
        venue = await this.venuesService.createOne({ ...input });
        for (const section of input.data.categories) {
          sections.push({ name: section[0], venueId: venue.id });
        }
        const newSections = await this.sectionsService.createMany(sections);
        for (const group in input.data.groups) {
          const section = newSections.find(
            (item) => item.name == String(input.data.groups[group].category),
          );
          for (const seat of input.data.groups[group].seats) {
            seats.push({
              row: input.data.groups[group].label,
              seat: seat.number,
              sectionId: section.id,
            });
          }
        }
        const newSeats = await this.seatsService.createMany(seats);
      } else {
        venue = await this.venuesService.createOne({ ...input });
        if (!input.sections || !input.sections.length) {
          sections.push({
            name: 'No section',
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
        const newSections = await this.sectionsService.createMany(sections);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return venue;
  }
}

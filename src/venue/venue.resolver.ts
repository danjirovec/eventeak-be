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
import { Row } from 'src/row/row.entity/row.entity';
import { RowDto } from 'src/row/row.dto/row.dto';
import { UpdateVenueDto } from './venue.dto/venue.update.dto';
import { randomUUID } from 'crypto';

@Resolver(() => VenueDto)
export class VenueResolver {
  constructor(
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
    @InjectQueryService(Seat)
    readonly seatService: QueryService<SeatDto>,
    @InjectQueryService(Section)
    readonly sectionService: QueryService<SectionDto>,
    @InjectQueryService(Row)
    readonly rowService: QueryService<RowDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => VenueDto)
  @UseGuards(AuthGuard)
  async createVenue(@Args('input') input: CreateVenueDto) {
    let venue;
    const sections = [];
    const seats = [];
    const rows = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (input.hasSeats) {
        const venueData = transformVenueData(input.seatMap);
        venue = await this.venueService.createOne({
          ...input,
          seatMap: venueData,
        });

        for (const section of venueData.sections) {
          sections.push({ name: section[0], venueId: venue.id });
        }
        const newSections = await this.sectionService.createMany(sections);

        for (const row in venueData.rows) {
          const section = newSections.find(
            (item) => item.name == (venueData.rows[row].sectionName as string),
          );
          rows.push({
            name: venueData.rows[row].rowName,
            sectionId: section.id,
          });
          venueData.rows[row].seats.map((seat, index) => {
            venueData.rows[row].seats[index].sectionId = section.id;
            seats.push({
              name: seat.seatNumber,
              sectionId: section.id,
            });
          });
        }
        const newRows = await this.rowService.createMany(rows);
        const newSeats = await this.seatService.createMany(seats);
        let rowIndex = 0;
        for (const row in venueData.rows) {
          venueData.rows[row].seats.map((seat, index) => {
            venueData.rows[row].seats[index].rowId = newRows[rowIndex].id;
            venueData.rows[row].seats[index].seatId = newSeats[index].id;
          });
          rowIndex += 1;
        }
        const { id, ...rest } = venue;
        await this.venueService.updateOne(id, {
          ...rest,
          seatMap: venueData,
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
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return venue;
  }

  @Mutation(() => VenueDto)
  @UseGuards(AuthGuard)
  async updateVenue(@Args('input') input: UpdateVenueDto) {
    let updatedVenue;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { sections, id, ...rest } = input;
      updatedVenue = await this.venueService.updateOne(id, {
        ...rest,
      });

      if (sections) {
        const originalSections = await this.sectionService.query({
          filter: { venueId: { eq: id } },
        });

        const sectionsToDelete = originalSections
          .filter((pc) => !sections.some((_pc) => _pc.id === pc.id))
          .map((pc) => pc.id);

        if (sectionsToDelete.length > 0) {
          await this.sectionService.deleteMany({
            id: { in: sectionsToDelete },
          });
        }

        sections.forEach((pc) => {
          if (!pc.id) pc.id = randomUUID();
        });

        await queryRunner.manager.upsert(Section, sections, ['id']);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return updatedVenue;
  }
}

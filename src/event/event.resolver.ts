import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { EventDto } from './event.dto/event.dto';
import { CreateEventDto } from './event.dto/event.create.dto';
import { UpdateEventDto } from './event.dto/event.update.dto';
import { Venue } from 'src/venue/venue.entity/venue.entity';
import { VenueDto } from 'src/venue/venue.dto/venue.dto';

@Resolver(() => EventDto)
export class EventResolver {
  constructor(
    @InjectQueryService(Event)
    readonly eventService: QueryService<EventDto>,
    @InjectQueryService(Venue)
    readonly venueService: QueryService<VenueDto>,
  ) {}

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async createEvent(@Args('input') input: CreateEventDto) {
    let newEvent;
    try {
      const venue = await this.venueService.getById(input.venueId);
      if (venue.hasSeats) {
        const venueData = venue.data;
        newEvent = await this.eventService.createOne({
          ...input,
          venueData: venueData,
        });
      } else {
        newEvent = await this.eventService.createOne({
          ...input,
        });
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
    return newEvent;
  }

  @Mutation(() => EventDto)
  @UseGuards(AuthGuard)
  async updateEvent(@Args('input') input: UpdateEventDto) {
    let updatedEvent;
    try {
      const { id, ...rest } = input;
      updatedEvent = await this.eventService.updateOne(id, {
        ...rest,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
    return updatedEvent;
  }
}

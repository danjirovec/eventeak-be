import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DataSource } from 'typeorm';
import { EventTemplateDto } from './event.template.dto/event.template.dto';
import { CreateEventTemplateDto } from './event.template.dto/event.template.create.dto';
import { EventTemplate } from './event.template.entity/event.template.entity';
import { EventPriceCategory } from 'src/event.price.category/event.price.category.entity/event.price.category.entity';
import { UpdateEventTemplateDto } from './event.template.dto/event.template.update.dto';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { EventPriceCategoryDto } from 'src/event.price.category/event.price.category.dto/event.price.category.dto';
import { randomUUID } from 'crypto';

@Resolver(() => EventTemplateDto)
export class EventTemplateResolver {
  constructor(
    @InjectQueryService(EventTemplate)
    readonly eventTemplateService: QueryService<EventTemplateDto>,
    @InjectQueryService(EventPriceCategory)
    readonly eventPriceCategoryService: QueryService<EventPriceCategoryDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => EventTemplateDto)
  @UseGuards(AuthGuard)
  async createEventTemplateAndEventPriceCategory(
    @Args('input') input: CreateEventTemplateDto,
  ) {
    let newTemplate = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newTemplate = queryRunner.manager.create(EventTemplate, {
        ...input,
      });
      await queryRunner.manager.save(newTemplate);

      if (input.eventPriceCategory) {
        for (const priceCategory of input.eventPriceCategory) {
          const newPriceCategory = queryRunner.manager.create(
            EventPriceCategory,
            {
              ...priceCategory,
              eventTemplateId: newTemplate.id,
            },
          );
          await queryRunner.manager.save(newPriceCategory);
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return newTemplate;
  }

  @Mutation(() => EventTemplateDto)
  @UseGuards(AuthGuard)
  async updateEventTemplateAndEventPriceCategory(
    @Args('input') input: UpdateEventTemplateDto,
  ) {
    const { eventPriceCategory, id, ...rest } = input;
    let updatedTemplate = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      updatedTemplate = await this.eventTemplateService.updateOne(id, {
        ...rest,
      });

      const priceCategories = await this.eventPriceCategoryService.query({
        filter: { eventTemplateId: { eq: id } },
      });

      const toDelete = priceCategories
        .filter((pc) => !eventPriceCategory.some((epc) => epc.id === pc.id))
        .map((pc) => pc.id);

      if (toDelete.length > 0) {
        await queryRunner.manager.delete(EventPriceCategory, toDelete);
      }

      for (const cat of eventPriceCategory) {
        if (!cat.id) {
          cat.id = randomUUID();
        }
      }

      if (eventPriceCategory) {
        const yo = await queryRunner.manager.upsert(
          EventPriceCategory,
          eventPriceCategory,
          ['id'],
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return updatedTemplate;
  }
}

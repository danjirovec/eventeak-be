import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DataSource } from 'typeorm';
import { TemplateDto } from './template.dto/template.dto';
import { CreateTemplateDto } from './template.dto/template.create.dto';
import { Template } from './template.entity/template.entity';
import { PriceCategory } from 'src/price.category/price.category.entity/price.category.entity';
import { UpdateTemplateDto } from './template.dto/template.update.dto';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { PriceCategoryDto } from 'src/price.category/price.category.dto/price.category.dto';
import { randomUUID } from 'crypto';
import { TemplateDiscountDto } from 'src/template.discount/template.discount.dto/template.discount.dto';
import { TemplateDiscount } from 'src/template.discount/template.discount.entity/template.discount.entity';

@Resolver(() => TemplateDto)
export class TemplateResolver {
  constructor(
    @InjectQueryService(Template)
    readonly templateService: QueryService<TemplateDto>,
    @InjectQueryService(PriceCategory)
    readonly priceCategoryService: QueryService<PriceCategoryDto>,
    @InjectQueryService(TemplateDiscount)
    readonly templateDiscountService: QueryService<TemplateDiscountDto>,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => TemplateDto)
  @UseGuards(AuthGuard)
  async createTemplate(@Args('input') input: CreateTemplateDto) {
    let newTemplate = null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createdTemplate = queryRunner.manager.create(Template, {
        ...input,
      });
      newTemplate = await queryRunner.manager.save(createdTemplate);
      const priceCategories = input.priceCategory.map((pc) => ({
        ...pc,
        templateId: newTemplate.id,
      }));
      await queryRunner.manager.save(PriceCategory, priceCategories);
      if (input.discount) {
        const discounts = input.discount.map((discount) => ({
          discountId: discount,
          templateId: newTemplate.id,
        }));
        await queryRunner.manager.save(TemplateDiscount, discounts);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newTemplate;
  }

  @Mutation(() => TemplateDto)
  @UseGuards(AuthGuard)
  async updateTemplate(@Args('input') input: UpdateTemplateDto) {
    let updatedTemplate = null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { priceCategory, discount, id, ...rest } = input;

      await queryRunner.manager.update(Template, id, { ...rest });
      updatedTemplate = await queryRunner.manager.findOne(Template, {
        where: { id },
      });

      const priceCategories = await this.priceCategoryService.query({
        filter: { templateId: { eq: id } },
      });

      const discounts = await this.templateDiscountService.query({
        filter: { templateId: { eq: id } },
      });

      const priceCategoryToDelete = priceCategories
        .filter((pc) => !priceCategory.some((_pc) => _pc.id === pc.id))
        .map((pc) => pc.id);

      const templateDiscountToDelete = discounts
        .filter(
          (item) =>
            !discount.some((discountId) => discountId === item.discountId),
        )
        .map((item) => item.discountId);

      if (priceCategoryToDelete.length > 0) {
        await this.priceCategoryService.deleteMany({
          id: { in: priceCategoryToDelete },
        });
      }

      if (templateDiscountToDelete.length > 0) {
        await this.templateDiscountService.deleteMany({
          discountId: { in: templateDiscountToDelete },
        });
      }

      priceCategory.forEach((pc) => {
        if (!pc.id) pc.id = randomUUID();
      });

      const templateDiscountToUpdate = discount.map((discountId) => ({
        discountId,
        templateId: updatedTemplate.id,
      }));

      await queryRunner.manager.upsert(PriceCategory, priceCategory, ['id']);
      await queryRunner.manager.upsert(
        TemplateDiscount,
        templateDiscountToUpdate,
        ['discountId', 'templateId'],
      );

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

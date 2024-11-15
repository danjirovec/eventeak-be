import { Discount } from 'src/discount/discount.entity/discount.entity';
import { Template } from 'src/template/template.entity/template.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Index(['discountId', 'templateId'])
export class TemplateDiscount {
  @PrimaryColumn('uuid', { name: 'discount_id' })
  discountId!: string;

  @ManyToOne((type) => Discount)
  @JoinColumn({ name: 'discount_id' })
  discount!: Discount;

  @PrimaryColumn('uuid', { name: 'template_id' })
  templateId!: string;

  @ManyToOne((type) => Template, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template!: Template;

  @CreateDateColumn()
  created!: Date;
}

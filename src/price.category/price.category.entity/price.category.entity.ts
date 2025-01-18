import { Template } from 'src/template/template.entity/template.entity';
import { Section } from 'src/section/section.entity/section.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['sectionId', 'templateId'])
export class PriceCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'float', default: 0 })
  price!: number;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Index()
  @Column({ name: 'section_id' })
  sectionId!: string;

  @ManyToOne((type) => Section)
  @JoinColumn({ name: 'section_id' })
  section!: Section;

  @Index()
  @Column({ name: 'template_id' })
  templateId!: string;

  @ManyToOne((type) => Template, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template!: Template;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

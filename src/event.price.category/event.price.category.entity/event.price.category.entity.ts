import { EventTemplate } from 'src/event.template/event.template.entity/event.template.entity';
import { Section } from 'src/section/section.entity/section.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EventPriceCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ name: 'section_id' })
  sectionId!: string;

  @ManyToOne((type) => Section)
  @JoinColumn({ name: 'section_id' })
  section!: Section;

  @Column({ name: 'event_template_id' })
  eventTemplateId!: string;

  @ManyToOne((type) => EventTemplate)
  @JoinColumn({ name: 'event_template_id' })
  eventTemplate!: EventTemplate;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

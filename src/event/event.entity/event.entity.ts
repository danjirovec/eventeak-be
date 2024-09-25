import { Business } from 'src/business/business.entity/business.entity';
import { Category, Language } from 'src/enum/enum';
import { EventTemplate } from 'src/event.template/event.template.entity/event.template.entity';
import { Venue } from 'src/venue/venue.entity/venue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  date!: Date;

  @Column()
  length!: number;

  @Column({ type: 'enum', enum: Category })
  category!: Category;

  @Column({ type: 'enum', enum: Language })
  language!: Language;

  @Column({ type: 'enum', enum: Language, nullable: true })
  subtitles?: Language;

  @Column({ nullable: true })
  posterUrl?: string;

  @Column({ type: 'json', nullable: true })
  venueData: any;

  @Column({ name: 'event_template_id' })
  eventTemplateId!: string;

  @ManyToOne((type) => EventTemplate)
  @JoinColumn({ name: 'event_template_id' })
  eventTemplate!: EventTemplate;

  @Column({ name: 'venue_id' })
  venueId!: string;

  @ManyToOne((type) => Venue)
  @JoinColumn({ name: 'venue_id' })
  venue!: Venue;

  @Column({ name: 'business_id' })
  businessId!: string;

  @ManyToOne((type) => Business)
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

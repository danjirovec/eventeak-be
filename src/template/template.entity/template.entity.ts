import { Business } from 'src/business/business.entity/business.entity';
import { Category, Language, Type } from 'src/enum/enum';
import { Venue } from 'src/venue/venue.entity/venue.entity';
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
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  length!: number;

  @Column({ type: 'enum', enum: Type })
  type!: Type;

  @Column({ type: 'enum', enum: Category })
  category!: Category;

  @Column({ type: 'enum', enum: Language, nullable: true })
  language!: Language;

  @Column({ type: 'enum', enum: Language, nullable: true })
  subtitles?: Language;

  @Column({ nullable: true })
  posterUrl?: string;

  @Column({ name: 'venue_id' })
  venueId!: string;

  @ManyToOne((type) => Venue)
  @JoinColumn({ name: 'venue_id' })
  venue!: Venue;

  @Index()
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

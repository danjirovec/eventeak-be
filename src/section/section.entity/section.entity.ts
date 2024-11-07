import { User } from 'src/user/user.entity/user.entity';
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
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  capacity?: number;

  @Index()
  @Column({ name: 'venue_id' })
  venueId!: string;

  @ManyToOne((type) => Venue)
  @JoinColumn({ name: 'venue_id' })
  venue!: Venue;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

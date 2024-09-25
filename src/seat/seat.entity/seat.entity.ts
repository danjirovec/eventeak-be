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
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  row!: string;

  @Column()
  seat!: number;

  @Column({ name: 'seat_id' })
  sectionId!: string;

  @ManyToOne((type) => Section, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  section!: Section;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

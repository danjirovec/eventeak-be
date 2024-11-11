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
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index()
  @Column({ name: 'section_id' })
  sectionId!: string;

  @ManyToOne((type) => Section, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section!: Section;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

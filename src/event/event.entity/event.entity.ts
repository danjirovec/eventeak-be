import { Business } from 'src/business/business.entity/business.entity';
import { Template } from 'src/template/template.entity/template.entity';
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
@Index(['businessId', 'templateId'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  date!: Date;

  @Column({ type: 'json', nullable: true })
  seatMap?: any;

  @Index()
  @Column({ name: 'template_id' })
  templateId!: string;

  @ManyToOne((type) => Template)
  @JoinColumn({ name: 'template_id' })
  template!: Template;

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

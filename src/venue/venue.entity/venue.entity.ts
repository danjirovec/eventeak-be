import { Business } from 'src/business/business.entity/business.entity';
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
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  capacity!: number;

  @Column()
  city!: string;

  @Column()
  street!: string;

  @Column()
  buildingNumber!: string;

  @Column()
  hasSeats!: boolean;

  @Column({ type: 'json', nullable: true })
  seatMap?: any;

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

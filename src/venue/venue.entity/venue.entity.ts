import { Business } from 'src/business/business.entity/business.entity';
import { Seat } from 'src/seat/seat.entity/seat.entity';
import { User } from 'src/user/user.entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  data: any;

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

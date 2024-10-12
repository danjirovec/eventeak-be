import { Business } from 'src/business/business.entity/business.entity';
import { User } from 'src/user/user.entity/user.entity';
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
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  percentage!: number;

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

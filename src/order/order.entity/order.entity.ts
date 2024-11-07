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
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  total!: number;

  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId!: string;

  @ManyToOne((type) => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

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

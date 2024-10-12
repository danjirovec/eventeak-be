import { Business } from 'src/business/business.entity/business.entity';
import { MembershipType } from 'src/membership.type/membership.type.entity/membership.type.entity';
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
@Index(['membershipTypeId', 'businessId'])
export class Benefit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  points!: number;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ name: 'membership_type_id', nullable: true })
  membershipTypeId?: string;

  @ManyToOne((type) => MembershipType, { nullable: true })
  @JoinColumn({ name: 'membership_type_id' })
  membershipType?: MembershipType;

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

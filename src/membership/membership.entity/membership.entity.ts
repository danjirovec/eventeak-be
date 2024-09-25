import { Business } from 'src/business/business.entity/business.entity';
import { MembershipType } from 'src/membership.type/membership.type.entity/membership.type.entity';
import { User } from 'src/user/user.entity/user.entity';
import { getOneYearExpiryDate } from 'src/utils/membershipExpiryDate';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 0 })
  points!: number;

  @Column({ default: getOneYearExpiryDate() })
  expiryDate!: Date;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'membership_type_id', nullable: true })
  membershipTypeId!: string;

  @ManyToOne((type) => MembershipType, { nullable: true })
  @JoinColumn({ name: 'membership_type_id' })
  membershipType!: MembershipType;

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
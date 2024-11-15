import { Business } from 'src/business/business.entity/business.entity';
import { MembershipState } from 'src/enum/enum';
import { MembershipType } from 'src/membership.type/membership.type.entity/membership.type.entity';
import { User } from 'src/user/user.entity/user.entity';
import { getOneYearExpiryDate } from 'src/utils/membershipExpiryDate';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['businessId', 'created'])
@Index(['businessId', 'userId'])
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 0 })
  points!: number;

  @Column({ default: getOneYearExpiryDate() })
  expiryDate!: Date;

  @Column({
    type: 'enum',
    enum: MembershipState,
    default: MembershipState.Active,
  })
  state!: MembershipState;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'membership_type_id' })
  membershipTypeId!: string;

  @ManyToOne((type) => MembershipType)
  @JoinColumn({ name: 'membership_type_id' })
  membershipType!: MembershipType;

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

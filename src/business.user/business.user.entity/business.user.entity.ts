import { Business } from 'src/business/business.entity/business.entity';
import { Role } from 'src/enum/enum';
import { User } from 'src/user/user.entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['businessId', 'created'])
@Index(['businessId', 'userId'])
export class BusinessUser {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @ManyToOne((type) => User, (user: User) => user.id)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Index()
  @PrimaryColumn('uuid', { name: 'business_id' })
  businessId!: string;

  @ManyToOne((type) => Business, (business: Business) => business.id)
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role!: Role;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

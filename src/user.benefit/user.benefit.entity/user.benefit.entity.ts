import { Benefit } from 'src/benefit/benefit.entity/benefit.entity';
import { Business } from 'src/business/business.entity/business.entity';
import { User } from 'src/user/user.entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class UserBenefit {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @PrimaryColumn('uuid', { name: 'benefit_id' })
  benefitId!: string;

  @ManyToOne((type) => Benefit)
  @JoinColumn({ name: 'benefit_id' })
  benefit!: Benefit;

  @PrimaryColumn('uuid', { name: 'business_id' })
  businessId!: string;

  @ManyToOne((type) => Business)
  @JoinColumn({ name: 'business_id' })
  business!: Business;
}

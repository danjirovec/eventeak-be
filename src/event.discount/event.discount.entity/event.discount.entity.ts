import { Benefit } from 'src/benefit/benefit.entity/benefit.entity';
import { Business } from 'src/business/business.entity/business.entity';
import { Discount } from 'src/discount/discount.entity/discount.entity';
import { Event } from 'src/event/event.entity/event.entity';
import { User } from 'src/user/user.entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Index(['discountId', 'eventId'])
export class EventDiscount {
  @PrimaryColumn('uuid', { name: 'discount_id' })
  discountId!: string;

  @ManyToOne((type) => Discount)
  @JoinColumn({ name: 'discount_id' })
  discount!: Discount;

  @PrimaryColumn('uuid', { name: 'event_id' })
  eventId!: string;

  @ManyToOne((type) => Event)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @CreateDateColumn()
  created!: Date;
}

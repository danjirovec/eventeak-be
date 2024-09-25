import { Discount } from 'src/discount/discount.entity/discount.entity';
import { Order } from 'src/order/order.entity/order.entity';
import { Seat } from 'src/seat/seat.entity/seat.entity';
import { User } from 'src/user/user.entity/user.entity';
import { Event } from 'src/event/event.entity/event.entity';
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
import { Section } from 'src/section/section.entity/section.entity';
import { Business } from 'src/business/business.entity/business.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  price!: number;

  @Column()
  validated!: boolean;

  @Column({ name: 'event_id' })
  eventId!: string;

  @ManyToOne((type) => Event)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({ name: 'section_id' })
  sectionId!: string;

  @ManyToOne((type) => Section)
  @JoinColumn({ name: 'section_id' })
  section!: Section;

  @Column({ name: 'discount_id', nullable: true })
  discountId!: string;

  @ManyToOne((type) => Discount, { nullable: true })
  @JoinColumn({ name: 'discount_id' })
  discount!: Discount;

  @Column({ name: 'user_id', nullable: true })
  userId!: string;

  @ManyToOne((type) => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'seat_id', nullable: true })
  seatId!: string;

  @OneToOne((type) => Seat, { nullable: true })
  @JoinColumn({ name: 'seat_id' })
  seat!: Seat;

  @Column({ name: 'order_id', nullable: true })
  orderId!: string;

  @ManyToOne((type) => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

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

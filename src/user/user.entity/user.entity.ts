import { Business } from 'src/business/business.entity/business.entity';
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
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Index()
  @Column({ name: 'default_business_id', nullable: true })
  defaultBusinessId?: string;

  @ManyToOne((type) => Business, { nullable: true })
  @JoinColumn({ name: 'default_business_id' })
  defaultBusiness?: Business;

  @Column({ nullable: true })
  placeOfResidence?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column()
  birthDate!: Date;

  @Column({ nullable: true })
  deleted?: Date;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}

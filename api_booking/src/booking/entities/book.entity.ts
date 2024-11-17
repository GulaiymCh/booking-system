import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';
import {IsNotEmpty} from "class-validator";

export enum BookStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}


@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @IsNotEmpty()
  @ManyToOne(() => Room, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @IsNotEmpty()
  @Column({ type: 'timestamp' })
  startDate: Date;

  @IsNotEmpty()
  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({type: 'enum', enum: BookStatus, default: BookStatus.PENDING})
  status: BookStatus
}

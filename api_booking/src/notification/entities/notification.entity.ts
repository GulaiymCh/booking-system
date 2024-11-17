import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "../../user/entities/user.entity";
import {IsNotEmpty} from "class-validator";

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  message: string;

  @ManyToOne(() => User, user => user.notifications)
  @IsNotEmpty()
  user: User;

  @Column({ default: false })
  isRead: boolean;
}
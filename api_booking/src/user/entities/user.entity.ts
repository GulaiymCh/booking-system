import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Notifications } from "../../notification/entities/notification.entity";
import {IsNotEmpty} from "class-validator";

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column({unique: true })
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @OneToMany(() => Notifications, notification => notification.user)
  notifications: Notification[];
}

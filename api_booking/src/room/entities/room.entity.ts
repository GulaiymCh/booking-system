import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column()
  capacity: number;
}

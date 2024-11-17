import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User, UserRole } from "../user/entities/user.entity";
import { Booking, BookStatus } from "../booking/entities/book.entity";
import { Room } from "../room/entities/room.entity";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class FixturesService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {
  }

  async clearDatabase() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Booking, {});
      await queryRunner.manager.delete(Room, {});
      await queryRunner.manager.delete(User, {});

      await queryRunner.commitTransaction();
      console.log('Database cleared successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async run() {
    await this.clearDatabase();

    const userArray = [
      {username: 'admin', role: UserRole.ADMIN, email: 'admin@gmail.com', password: await bcrypt.hash('admin', 12)},
      {username: 'user', role: UserRole.CLIENT, email: 'user@gmail.com', password: await bcrypt.hash('user', 12)},
      {username: 'user2', role: UserRole.CLIENT, email: 'user2@gmail.com', password: await bcrypt.hash('user2', 12)},
    ];
    const [admin, user, user2] = await this.usersRepository.save(userArray);

    const roomsArray = [
      {name: 'room1', description: 'room 1', capacity: 10, price: 1000, isAvailable: false},
      {name: 'room2', description: 'room 2', capacity: 20, price: 2000, isAvailable: true},
      {name: 'room3', description: 'room 3', capacity: 30, price: 3000, isAvailable: false},
    ];
    const [room1, room2, room3] = await this.roomRepository.save(roomsArray);

    await this.bookingRepository.save([
      {user: user, room: room1, startDate: new Date("2024-11-17T15:30:00Z"), endDate: new Date("2024-11-20T15:30:00Z")},
      {user: user2, room: room3, startDate: new Date("2024-10-17T15:30:00Z"), endDate: new Date("2024-11-20T15:30:00Z"), status: BookStatus.CONFIRMED}
    ]);
  }
}
import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "./entities/book.entity";
import { Room } from "../room/entities/room.entity";
import { User } from "../user/entities/user.entity";
import { Notifications } from "../notification/entities/notification.entity";
import { NotificationService } from "../notification/notification.service";

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room, User, Notifications])],
  controllers: [BookingController],
  providers: [BookingService, NotificationService],
})
export class BookingModule {}

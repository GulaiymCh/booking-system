import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "./user/user.module";
import {BookingModule} from "./booking/booking.module";
import {RoomModule} from "./room/room.module";
import {ConfigModule} from "@nestjs/config";
import {FixturesService} from "./db/fixtures.service";
import {User} from "./user/entities/user.entity";
import {Booking} from "./booking/entities/book.entity";
import {Room} from "./room/entities/room.entity";
import {NotificationModule} from './notification/notification.module';
import {Notifications} from "./notification/entities/notification.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres741",
      database: "booking_db",
      entities: [User, Booking, Room, Notifications],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Booking, Room, Notifications]),
    UserModule,
    BookingModule,
    RoomModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    FixturesService,
  ],
})
export class AppModule {}
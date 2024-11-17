import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Notifications } from "./entities/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Notifications])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}

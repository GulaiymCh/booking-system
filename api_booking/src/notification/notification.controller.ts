import { Controller, Get, Param } from "@nestjs/common";
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }
}

import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Notifications} from "./entities/notification.entity";
import {validate} from "class-validator";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async getNotificationsForUser(userId: number) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async sendNotification(userId: number, message: string): Promise<Notifications> {
    try {
      const user = await this.userRepository.findOne({where: {id: userId}});
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const notification = new Notifications();
      notification.user = user;
      notification.message = message;

      const validationErrors = await validate(notification);
      if (validationErrors.length > 0) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      return await this.notificationRepository.save(notification);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}

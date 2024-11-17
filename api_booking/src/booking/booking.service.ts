import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Booking, BookStatus} from "./entities/book.entity";
import {User} from "../user/entities/user.entity";
import {Room} from "../room/entities/room.entity";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {NotificationService} from "../notification/notification.service";
import {UpdateBookingDto} from "./dto/update-booking.dto";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private readonly notificationService: NotificationService
  ) {}

  async createBooking(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<Booking> {
    try {
      const { roomId, startDate, endDate } = createBookingDto;

      const user = await this.usersRepository.findOne({ where: { id: userId } });
      const room = await this.roomsRepository.findOne({ where: { id: roomId } });

      if (!user || !room) {
        throw new NotFoundException("User or Room not found");
      }

      const newBooking = this.bookingRepository.create({
        user,
        room,
        startDate,
        endDate,
      });

      return this.bookingRepository.save(newBooking);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    try {
      return this.bookingRepository.find({ where: { user: { id: userId } } });
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      return this.bookingRepository.find();
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateBookingStatus(
    bookingId: number,
    status: BookStatus,
    userId: number
  ): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id: bookingId },
      });
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      booking.status = status;

      if (status !== BookStatus.PENDING) {
        let message = "";
        if (status === BookStatus.CONFIRMED) {
          message = "Ваше бронирование было подтверждено!";
        } else if (status === BookStatus.CANCELED) {
          message = "Ваше бронирование было отменено!";
        }

        await this.notificationService.sendNotification(userId, message);
      }

      if (status === BookStatus.CONFIRMED) {
        booking.room.isAvailable = false;
      } else {
        booking.room.isAvailable = true;
      }
      await this.roomsRepository.save(booking.room);

      return await this.bookingRepository.save(booking);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getBookingsWithFilters(status?: string, startDate?: Date, endDate?: Date) {
    try {
      const query = this.bookingRepository.createQueryBuilder('booking');

      if (status) {
        query.andWhere('booking.status = :status', { status });
      }

      if (startDate && endDate) {
        query.andWhere('booking.startDate BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      return await query.getMany();
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getPaginatedBookings(page: number = 1, limit: number = 10) {
    try {
      const [result, total] = await this.bookingRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: result,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    }  catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto, userId: number) {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.user.id !== userId) {
        throw new ForbiddenException('You do not have permission to update this booking');
      }

      Object.assign(booking, updateBookingDto);
      return await this.bookingRepository.save(booking);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteBooking(id: number, userId: number) {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id: id } });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.user.id !== userId) {
        throw new ForbiddenException('You do not have permission to delete this booking');
      }

      await this.bookingRepository.remove(booking);
      return { message: 'Booking successfully deleted' };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

}


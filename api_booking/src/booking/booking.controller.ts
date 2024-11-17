import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards} from "@nestjs/common";
import {BookingService} from "./booking.service";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {CurrentUser} from "../user/decorator/current-user.decorator";
import {Roles} from "../user/decorator/role.decoratoe";
import {UserRole} from "../user/entities/user.entity";
import {BookStatus} from "./entities/book.entity";
import {JwtAuthGuard} from "../user/guards/jwt-auth.guard";
import {RolesGuard} from "../user/guards/roles.guard";
import {UpdateBookingDto} from "./dto/update-booking.dto";

@Controller("booking")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @CurrentUser() user: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(createBookingDto, user.id);
  }

  @Get("my-bookings")
  async getUserBookings(@CurrentUser() user: any) {
    return this.bookingService.getUserBookings(user.id);
  }

  @Get("all-bookings")
  @Roles(UserRole.ADMIN)
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get("filter")
  async getBookingsWithFilters(
    @Query('status') status?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.bookingService.getBookingsWithFilters(status, startDate, endDate);
  }

  @Get()
  async getPaginatedBookings(
  ) {
    return this.bookingService.getPaginatedBookings();
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: BookStatus,
    @Body('userId') userId: number,
  ) {
    return this.bookingService.updateBookingStatus(id, status, userId);
  }

  @Put(':id')
  async updateBooking(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return await this.bookingService.updateBooking(id, updateBookingDto, userId);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    return await this.bookingService.deleteBooking(id, userId);
  }

}

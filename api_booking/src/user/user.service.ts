import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {RegisterDto} from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      const { username, email, password, role } = registerDto;

      const existingUser = await this.userRepository.findOne({where: {email: email}});
      if (existingUser) {
        throw new ConflictException('This user is already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = this.userRepository.create({
        username,
        email,
        password: hashedPassword,
        role
      })

      await this.userRepository.save(newUser)

      const payload = { email, sub: newUser.id, role };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginDto: LoginDto): Promise<{access_token: string}> {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({where: {email: email}});

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}

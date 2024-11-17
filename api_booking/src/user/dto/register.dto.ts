import {IsString, IsEmail, IsNotEmpty} from 'class-validator';
import { UserRole } from "../entities/user.entity";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  role: UserRole;
}

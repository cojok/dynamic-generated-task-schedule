import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../db/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const hashPassword: string = await this.utilsService.hashPassword(pass);
    const user = await this.usersService.findUserBy({
      username,
      password: hashPassword,
    });
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<Object> {
    const data = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(data),
    };
  }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.usersService.createUser(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }
}

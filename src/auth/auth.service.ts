import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../db/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UtilsService } from '../utils/utils.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';

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

  async login(user: User): Promise<LoginStatus> {
    const token = this.createAccessToken(user);
    return {
      username: user.username,
      accessToken: token,
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

  private createAccessToken({ username, id }: User): String {
    const user: JwtPayload = { username, sub: id };
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }
}

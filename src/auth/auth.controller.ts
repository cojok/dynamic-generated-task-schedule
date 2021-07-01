import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../user/dto/login-user.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Logged in successful',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  async login(@Request() req): Promise<LoginStatus> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Wrong data!' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }
}

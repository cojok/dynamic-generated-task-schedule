import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { GetUserByIdDto, GetUserDto } from './dto/index.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  getProfile(@Param() params: GetUserByIdDto): Promise<GetUserDto> {
    return this.userService.findOne({ id: params.id });
  }
}

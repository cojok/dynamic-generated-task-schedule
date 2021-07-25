import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { validateOrReject } from 'class-validator';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from '../user/user.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    validateOrReject(createCompanyDto).catch((error) => {
      this.logger.error({ error }, 'Wrong payload data');
      throw new BadRequestException('Wrong payload data');
    });
    return this.companyService.create(createCompanyDto);
  }

  @UseGuards(AuthGuard('local'))
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    if (!req || Object.prototype.hasOwnProperty.call(req, 'userId')) {
      this.logger.error({ req }, 'Something is funny here');
      throw new ForbiddenException('Hold your horses cowboy');
    }
    const isOwner = this.userService.findUserBy({
      id: req.userId,
      companyId: id,
    });
    if (!isOwner) {
      throw new ForbiddenException(
        'Hold your horses cowboy. Not your company, not your business',
      );
    }
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ) {
    if (!req || Object.prototype.hasOwnProperty.call(req, 'userId')) {
      this.logger.error({ req }, 'Something is funny here');
      throw new ForbiddenException('Hold your horses cowboy');
    }
    const isOwner = this.userService.findUserBy({
      id: req.userId,
      companyId: id,
    });
    if (!isOwner) {
      throw new ForbiddenException(
        'Hold your horses cowboy. Not your company, not your business',
      );
    }
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (!req || Object.prototype.hasOwnProperty.call(req, 'userId')) {
      this.logger.error({ req }, 'Something is funny here');
      throw new ForbiddenException('Hold your horses cowboy');
    }
    const isOwner = this.userService.findUserBy({
      id: req.userId,
      companyId: id,
    });
    if (!isOwner) {
      throw new ForbiddenException(
        'Hold your horses cowboy. Not your company, not your business',
      );
    }
    return this.companyService.remove(id);
  }
}

import { PinoLogger } from 'nestjs-pino';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConnectorsService } from './connectors.service';
import {
  CreateConnectorsDto,
  GetConnectorsById,
  GetConnectorsDto,
} from './dto/index.dto';
import { CreateConnectorStatus } from './interfaces/create-connector-status.interface';

@ApiTags('connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(
    private connectorsService: ConnectorsService,
    private readonly logger: PinoLogger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Record found',
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  getConnectorsById(
    @Param() params: GetConnectorsById,
    @Request() req,
  ): Promise<GetConnectorsDto> {
    if (!params || !Object.prototype.hasOwnProperty.call(params, 'id')) {
      this.logger.error({ req }, 'Wrong data in payload');
      throw new BadRequestException('Wrong data in payload');
    }
    const { userId } = req.user;
    return this.connectorsService
      .findOne({
        id: params.id,
        userId,
      })
      .catch((error) => {
        this.logger.warn({ error }, 'No connector found');
        throw new NotFoundException('No connector found');
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @ApiResponse({ status: 201, description: 'Created successful' })
  @ApiResponse({ status: 400, description: 'Wrong data!' })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  // eslint-disable-next-line class-methods-use-this
  async createConnector(
    @Request() req,
    @Body() createConnectorDto: CreateConnectorsDto,
  ): Promise<CreateConnectorStatus> {
    // eslint-disable-next-line no-param-reassign
    createConnectorDto.userId = req.user.userId;
    const result: CreateConnectorStatus =
      await this.connectorsService.createConnector(createConnectorDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiResponse({ status: 200, description: 'connectors found' })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getAllConnectors(@Request() req): Promise<GetConnectorsDto[]> {
    const { userId } = req.user;
    return this.connectorsService.findAllByUserId({ userId });
  }
}

import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Office365Service } from './office365.service';
import { Office365AuthResponseDto } from './dto';
import { ConnectorsService } from '../connectors/connectors.service';

@Controller('office365')
export class Office365Controller {
  constructor(
    private readonly logger: PinoLogger,
    private office365Service: Office365Service,
    private connectorsService: ConnectorsService,
  ) {
    logger.setContext('office365-model');
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiResponse({ status: 200, description: 'connectors found' })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getToken(@Request() req): Promise<Office365AuthResponseDto> {
    const { userId } = req.user;
    const userConnectors = this.connectorsService.findAllByUserId({
      user_id: userId,
    });
    const authority = userConnectors[0].aad_url + userConnectors[0].tenant_id;
    const authConfig = {
      auth: {
        clientId: userConnectors[0].client_id,
        authority,
        clientSecret: userConnectors[0].client_secret,
      },
    };
    return this.office365Service.getToken(authConfig);
  }
}

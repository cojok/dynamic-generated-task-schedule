import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Office365Service } from './office365.service';
import { Office365AuthResponseDto } from './dto';
import { ConnectorsService } from '../connectors/connectors.service';

@ApiTags('office365')
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
  @Get('/token')
  @ApiResponse({ status: 200, description: 'get token details' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getToken(@Request() req): Promise<Office365AuthResponseDto> {
    const { userId } = req.user;
    const userConnectors = await this.connectorsService.findAllByUserId({
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

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  @ApiResponse({ status: 200, description: 'get all users' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUsers(@Query() query): Promise<any> {
    return this.office365Service.getUsers(query.accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id')
  @ApiResponse({ status: 200, description: 'get user details' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserDetails(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserById(req.params.id, query.accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/emails/inbox')
  @ApiResponse({
    status: 200,
    description: 'get all inbox emails for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserInbox(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailsInbox(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/emails/outbox')
  @ApiResponse({
    status: 200,
    description: 'get all emails in the outbox for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserOutbox(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailsSentItems(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/emails/drafts')
  @ApiResponse({
    status: 200,
    description: 'get all emails in draft for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserDraftBox(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailsDrafts(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/emails/deleted')
  @ApiResponse({
    status: 200,
    description: 'get all deleted emails for the users',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserDeletedBox(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailsDeletedItems(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/emails/:emailId')
  @ApiResponse({ status: 200, description: 'get email content for the users' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserEmailContent(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailById(
      req.params.id,
      req.params.emailId,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/:id/sent-email')
  @ApiResponse({ status: 201, description: 'email sent' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 400, description: "I don't know what you want" })
  @ApiResponse({ status: 422, description: 'Wrong data format' })
  // eslint-disable-next-line class-methods-use-this
  sentEmail(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.sentEmail(
      req.params.id,
      req.body.emailContent,
      query.accessToken,
    );
  }
}

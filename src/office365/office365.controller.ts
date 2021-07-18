import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConnectorsService } from '../connectors/connectors.service';
import { Office365AuthResponseDto } from './dto';
import { Office365Service } from './office365.service';

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
      userId,
    });
    const authority =
      userConnectors[0].connectionData.aadUrl +
      userConnectors[0].connectionData.tenantId;
    const authConfig = {
      auth: {
        clientId: userConnectors[0].connectionData.clientId,
        authority,
        clientSecret: userConnectors[0].connectionData.clientSecret,
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
  @Get('/users/:id/calendars/events')
  @ApiResponse({ status: 200, description: 'get all events for the user' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserCalendarEvents(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserCalendarEvents(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/calendars/:eventId')
  @ApiResponse({ status: 200, description: 'get event content for the user' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserCalendarEventContent(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserEmailById(
      req.params.id,
      req.params.eventId,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/calendars')
  @ApiResponse({ status: 200, description: 'get all calendars for the user' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserCalendars(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getUserCalendars(
      req.params.id,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/calendars/:calendarId')
  @ApiResponse({
    status: 200,
    description: 'get calendar details for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserCalendarsDetails(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getCalendarsDetail(
      req.params.id,
      req.params.calendarId,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/calendars/:calendarId/events')
  @ApiResponse({
    status: 200,
    description: 'get specific calendar events for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserSpecificCalendarEvents(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.getSpecificCalendarsEvents(
      req.params.id,
      req.params.calendarId,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id/calendars/:calendarId/events/:eventId')
  @ApiResponse({
    status: 200,
    description: 'get specific calendar event details for the user',
  })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 404, description: 'Not found' })
  // eslint-disable-next-line class-methods-use-this
  getUserSpecificCalendarsEventDetails(
    @Request() req,
    @Query() query,
  ): Promise<any> {
    return this.office365Service.getSpecificCalendarEventDetails(
      req.params.id,
      req.params.calendarId,
      req.params.eventId,
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
      req.body,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/:id/create-event')
  @ApiResponse({ status: 201, description: 'event created' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 400, description: "I don't know what you want" })
  @ApiResponse({ status: 422, description: 'Wrong data format' })
  // eslint-disable-next-line class-methods-use-this
  createCalendarEvent(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.sentEmail(
      req.params.id,
      req.body,
      query.accessToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/:id/calendars/:calendarId/create-event')
  @ApiResponse({ status: 201, description: 'event created' })
  @ApiResponse({ status: 401, description: 'Not hey' })
  @ApiResponse({ status: 400, description: "I don't know what you want" })
  @ApiResponse({ status: 422, description: 'Wrong data format' })
  // eslint-disable-next-line class-methods-use-this
  createSpecificCalendarEvent(@Request() req, @Query() query): Promise<any> {
    return this.office365Service.createSpecificCalendarEvent(
      req.params.id,
      req.body.eventData,
      req.body.timezone,
      req.params.calendarId,
      query.accessToken,
    );
  }
}

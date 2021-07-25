import { ConfidentialClientApplication } from '@azure/msal-node';
import { Injectable } from '@nestjs/common/decorators';
import { HttpService } from '@nestjs/common/http';
import { AxiosResponse } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { Observable, map } from 'rxjs';
import { Office365AuthResponseDto } from './dto';

@Injectable()
export class Office365Service {
  msalConfig: {
    auth: { clientId: string; authority: string; clientSecret: string };
  };

  tokenRequest: { scopes: string[] };

  apiConfig: { uri: string };

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext('office365-model');
    this.tokenRequest = {
      scopes: [`https://graph.microsoft.com/.default`],
    };

    this.apiConfig = {
      uri: `https://graph.microsoft.com/v1.0/users/`,
    };
  }

  async getToken(authConfig: any): Promise<Office365AuthResponseDto> {
    this.msalConfig = authConfig;
    const cca = new ConfidentialClientApplication(this.msalConfig);
    const authResponse = await cca.acquireTokenByClientCredential(
      this.tokenRequest,
    );
    return {
      accessToken: authResponse.accessToken,
      expiration: authResponse.extExpiresOn,
      tokenType: authResponse.tokenType,
    };
  }

  async getUsers(
    accessToken: String,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const users = await this.httpService.get(this.apiConfig.uri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return users.pipe(map((response) => response.data));
  }

  async getUserById(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const user = await this.httpService.get(`${this.apiConfig.uri}${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return user.pipe(map((response) => response.data));
  }

  async getUserEmailsInbox(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const inboxEmails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/mailFolders/inbox/messages?$select=bodyPreview,subject,sender,sentDateTime,importance,isRead,flag,receivedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return inboxEmails.pipe(map((response) => response.data));
  }

  async getUserEmailsSentItems(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const sentEmails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/mailFolders/sentItems/messages?$select=bodyPreview,subject,sender,sentDateTime,importance,isRead,flag,receivedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return sentEmails.pipe(map((response) => response.data));
  }

  async getUserEmailsDrafts(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const draftEmails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/mailFolders/drafts/messages?$select=bodyPreview,subject,sender,sentDateTime,importance,isRead,flag,receivedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return draftEmails.pipe(map((response) => response.data));
  }

  async getUserEmailsDeletedItems(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const deletedEmails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/mailFolders/deletedItems/messages?$select=bodyPreview,subject,sender,sentDateTime,importance,isRead,flag,receivedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return deletedEmails.pipe(map((response) => response.data));
  }

  async getUserEmailById(
    userId: string,
    emailId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const emailContent = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/messages/${emailId}?$select=body,categories,ccRecipients,bccRecipients,createdDateTime,flag,sender,sentDateTime,attachments,isDraft,isRead,receivedDateTime,replyTo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return emailContent.pipe(map((response) => response.data));
  }

  async getUserCalendarEvents(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const calendarEvents = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/events/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return calendarEvents.pipe(map((response) => response.data));
  }

  async getUserCalendarEventContent(
    userId: string,
    eventId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const emailContent = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return emailContent.pipe(map((response) => response.data));
  }

  async getUserCalendars(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const calendars = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/calendars/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return calendars.pipe(map((response) => response.data));
  }

  async getCalendarsDetail(
    userId: string,
    calendarId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const calendarsDetails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/calendars/${calendarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return calendarsDetails.pipe(map((response) => response.data));
  }

  async getSpecificCalendarsEvents(
    userId: string,
    calendarId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const calendarEvents = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/calendars/${calendarId}/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return calendarEvents.pipe(map((response) => response.data));
  }

  async getSpecificCalendarEventDetails(
    userId: string,
    calendarId: string,
    eventId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const calendarsDetails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/calendars/${calendarId}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return calendarsDetails.pipe(map((response) => response.data));
  }

  async sentEmail(
    userId: string,
    emailData: {
      subject: string;
      content: string;
      contentType: string;
      toRecipients: [
        {
          email: string;
          name: string;
        },
      ];
      ccRecipients: [
        {
          email: string;
          name: string;
        },
      ];
      bcRecipients: [
        {
          email: string;
          name: string;
        },
      ];
      options: {
        importance: string;
        saveToSentItems: boolean;
      };
    },
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const {
      subject,
      content,
      contentType,
      toRecipients,
      // ccRecipients,
      // bcRecipients,
      options,
    } = emailData;

    const message = {
      subject,
      importance: options.importance || 'Low',
      body: {
        content,
        contentType: contentType || 'HTML',
      },
      toRecipients: toRecipients.map((recipient) => ({
        emailAddress: {
          name: recipient.name,
          address: recipient.email,
        },
      })),
    };

    // TODO: enable later this options
    // message.ccRecipients = ccRecipients.map((recipient) => {
    //   return {
    //     emailAddress: {
    //       name: recipient.name,
    //       address: recipient.email
    //     }
    //   };
    // });

    // message.bcRecipients = bcRecipients.map((recipient) => {
    //   return {
    //     emailAddress: {
    //       name: recipient.name,
    //       address: recipient.email
    //     }
    //   };
    // });

    const email = {
      message,
      saveToSentItems: options.saveToSentItems || 'true',
    };

    const sentEmail = await this.httpService.post(
      `${this.apiConfig.uri}${userId}/sendMail`,
      email,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return sentEmail.pipe(map((response) => response.data));
  }

  async createCalendarEvent(
    userId: string,
    eventData: {
      subject: string;
      body: string;
      start: string;
      end: string;
      attendees: string[];
    },
    timeZone: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const newEvent = {
      subject: eventData.subject,
      start: {
        dateTime: eventData.start,
        timeZone,
      },
      end: {
        dateTime: eventData.end,
        timeZone,
      },
      body: {
        contentType: 'text',
        content: eventData.body,
      },
      attendees: [],
    };
    if (eventData.attendees) {
      eventData.attendees.forEach((attendee) => {
        newEvent.attendees.push({
          type: 'required',
          emailAddress: {
            address: attendee,
          },
        });
      });
    } else {
      throw new Error("Can't creat event without at least 1 attendee");
    }
    return await this.httpService.post(
      `${this.apiConfig.uri}${userId}/events`,
      newEvent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  async createSpecificCalendarEvent(
    userId: string,
    eventData: {
      subject: string;
      body: string;
      start: string;
      end: string;
      attendees: string[];
    },
    timeZone: string,
    calendarId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const newEvent = {
      subject: eventData.subject,
      start: {
        dateTime: eventData.start,
        timeZone,
      },
      end: {
        dateTime: eventData.end,
        timeZone,
      },
      body: {
        contentType: 'text',
        content: eventData.body,
      },
      attendees: [],
    };
    if (eventData.attendees) {
      eventData.attendees.forEach((attendee) => {
        newEvent.attendees.push({
          type: 'required',
          emailAddress: {
            address: attendee,
          },
        });
      });
    } else {
      throw new Error("Can't creat event without at least 1 attendee");
    }
    return await this.httpService.post(
      `${this.apiConfig.uri}${userId}/calendars/${calendarId}/events`,
      newEvent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }
}

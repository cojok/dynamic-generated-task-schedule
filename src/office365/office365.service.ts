import { ConfidentialClientApplication } from '@azure/msal-node';
import { Injectable } from '@nestjs/common/decorators';
import { HttpService } from '@nestjs/common/http';
import { AxiosResponse } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
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
}

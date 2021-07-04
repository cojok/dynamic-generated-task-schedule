import { Injectable } from '@nestjs/common/decorators';
import { HttpService } from '@nestjs/common/http';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs/internal/Observable';
// import * as msal from '@azure/msal-node';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { PinoLogger } from 'nestjs-pino';
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
      scopes: [`${process.env.GRAPH_ENDPOINT}.default`],
    };

    this.apiConfig = {
      uri: `${process.env.GRAPH_ENDPOINT}v1.0/users/`,
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
    return users;
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
    return user;
  }

  async getUserSentEmails(
    userId: string,
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any[]>>> {
    const sentMails = await this.httpService.get(
      `${this.apiConfig.uri}${userId}/mailFolders/sentItems/messages?$select=bodyPreview,subject,sender,sentDateTime,importance,isRead,flag,receivedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return sentMails;
  }
}

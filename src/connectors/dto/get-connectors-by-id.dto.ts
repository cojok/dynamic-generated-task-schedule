import { IsUUID, IsObject } from 'class-validator';
import { ConnectorsConnectionDataOffice365 } from '../interfaces/connectors-connection-data-office365.interface';

export class GetConnectorsById {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsObject()
  connectionData?: ConnectorsConnectionDataOffice365;
}

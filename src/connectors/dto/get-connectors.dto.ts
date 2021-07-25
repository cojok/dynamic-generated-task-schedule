import { IsUUID, IsString, IsObject } from 'class-validator';
import { ConnectorsConnectionDataOffice365 } from '../interfaces/connectors-connection-data-office365.interface';

export class GetConnectorsDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsObject()
  connectionData: ConnectorsConnectionDataOffice365;

  @IsString()
  userId: string;
}

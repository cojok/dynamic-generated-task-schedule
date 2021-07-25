import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsObject } from 'class-validator';
import { ConnectorsConnectionDataOffice365 } from '../interfaces/connectors-connection-data-office365.interface';

export class CreateConnectorsDto {
  @ApiProperty({
    default: {
      clientId: 'client_id',
      clientSecret: 'client_secret',
      tenantId: 'tenant_id',
      aadUrl: 'aad_endpoint',
      graphUrl: 'graph_endpoint',
    },
  })
  @IsObject()
  connectionData: ConnectorsConnectionDataOffice365;

  @ApiProperty({ default: 'user id' })
  @IsUUID()
  userId: string;

  @ApiProperty({ default: 'connector_name' })
  @IsString()
  name: string;
}

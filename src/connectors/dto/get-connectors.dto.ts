import { IsUUID, IsString } from 'class-validator';

export class GetConnectorsDto {
  @IsUUID()
  id: string;

  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;

  @IsString()
  tenant_id: string;

  @IsString()
  aad_url: string;

  @IsUUID()
  graph_url: string;
}

import { IsUUID, IsString } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  id: string;

  @IsUUID()
  client_id: string;

  @IsUUID()
  client_secret: string;

  @IsUUID()
  tenant_id: string;

  @IsString()
  aad_url: string;

  @IsUUID()
  graph_url: string;
}

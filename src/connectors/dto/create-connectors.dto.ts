import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateConnectorsDto {
  @ApiProperty({ default: 'client_id' })
  @IsString()
  client_id: string;

  @ApiProperty({ default: 'client_secret' })
  @IsString()
  client_secret: string;

  @ApiProperty({ default: 'tenant_id' })
  @IsString()
  tenant_id: string;

  @ApiProperty({ default: 'aad_endpoint' })
  @IsString()
  aad_url: string;

  @ApiProperty({ default: 'graph_endpoint' })
  @IsString()
  graph_url: string;

  @ApiProperty({ default: 'user id' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ default: 'connector_name' })
  @IsString()
  name: string;
}

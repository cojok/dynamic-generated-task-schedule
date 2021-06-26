import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateConnectorsDto {
  @ApiProperty({ default: 'client_id' })
  @IsUUID('all')
  client_id: string;

  @ApiProperty({ default: 'client_secret' })
  @IsUUID('all')
  client_secret: string;

  @ApiProperty({ default: 'tenant_id' })
  @IsUUID('all')
  tenant_id: string;

  @ApiProperty({ default: 'aad_endpoint' })
  @IsString()
  aad_endpoint: string;

  @ApiProperty({ default: 'graph_endpoint' })
  @IsString()
  graph_endpoint: string;
}

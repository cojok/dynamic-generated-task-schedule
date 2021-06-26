import { IsUUID } from 'class-validator';
import { GetConnectorsById } from './get-connectors-by-id.dto';

export class DeleteConnectors extends GetConnectorsById {
  @IsUUID()
  user_id: string;
}

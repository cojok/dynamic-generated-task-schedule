import { IsUUID } from 'class-validator';

export class GetConnectorsByUserId {
  @IsUUID()
  user_id: string;
}

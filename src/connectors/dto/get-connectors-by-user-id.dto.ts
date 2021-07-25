import { IsUUID } from 'class-validator';

export class GetConnectorsByUserId {
  @IsUUID()
  userId: string;
}

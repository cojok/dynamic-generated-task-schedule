import { IsUUID } from 'class-validator';

export class GetConnectorsById {
  @IsUUID()
  id: string;
}

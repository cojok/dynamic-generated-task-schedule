import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserByIdDto {
  @ApiProperty({ default: 'id' })
  @IsUUID()
  id: string;
}

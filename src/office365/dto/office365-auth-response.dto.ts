import { IsDateString, IsString } from 'class-validator';

export class Office365AuthResponseDto {
  @IsString()
  accessToken: string;

  @IsDateString()
  expiration: Date;

  @IsString()
  tokenType: string;
}

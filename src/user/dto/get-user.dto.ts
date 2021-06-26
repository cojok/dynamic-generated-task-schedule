import { IsUUID, IsOptional, IsEmail, IsString } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;
}

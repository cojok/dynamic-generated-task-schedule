import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ minLength: 5, default: 'Test Swagger' })
  @IsString()
  @MinLength(5)
  name: string;

  @ApiProperty({ default: 'test@swagger.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, default: 'test1234!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ minLength: 5, default: 'swagger_user' })
  @IsString()
  @MinLength(5)
  username: string;
}

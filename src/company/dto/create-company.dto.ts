import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';
import { Address } from '../../shared/interfaces/address.interface';

export class CreateCompanyDto {
  @ApiProperty({ default: 'companyName' })
  @IsString()
  name: string;

  @ApiProperty({ default: '001212345678901' })
  @IsNumberString()
  @MinLength(15, {
    message: 'It is the full number',
  })
  @MaxLength(15, {
    message: 'It is the full number',
  })
  phone: number;

  @ApiProperty()
  @IsObject()
  address: Address;

  @ApiProperty({ default: 'accountStatus' })
  @IsString()
  accountStatus: string;

  @ApiProperty({ default: 'paymentId' })
  @IsString()
  paymentId: string;

  @ApiProperty({ default: 'planId' })
  @IsString()
  planId: string;
}

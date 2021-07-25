/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { ConfigService } from '../config/config.service';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  public async hashPassword(password: string): Promise<string> {
    const salt = this.configService.get('SC_SALT');
    const hashPassword: string = await createHash('sha512')
      .update(salt)
      .update(password)
      .digest('hex');
    return hashPassword;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connectors } from '../db/entities/connectors.entity';
import { UtilsService } from '../utils/utils.service';
import {
  CreateConnectorsDto,
  GetConnectorsById,
  GetConnectorsByUserId,
} from './dto/index.dto';
import { CreateConnectorStatus } from './interfaces/create-connector-status.interface';

@Injectable()
export class ConnectorsService {
  constructor(
    @InjectRepository(Connectors)
    private connectorsRepository: Repository<Connectors>,
    private utilsService: UtilsService,
  ) {}

  async findOne(data: GetConnectorsById): Promise<Connectors | undefined> {
    const connector: Connectors = await this.connectorsRepository.findOne(data);
    return connector;
  }

  async findAllByUserId(userId: GetConnectorsByUserId): Promise<Connectors[]> {
    return this.connectorsRepository.find(userId);
  }

  async createConnector(
    data: CreateConnectorsDto,
  ): Promise<CreateConnectorStatus> {
    let status: CreateConnectorStatus = {
      success: true,
      message: 'connector created',
    };
    const connector: Connectors = new Connectors();
    connector.name = data.name;
    connector.client_id = data.client_id;
    connector.client_secret = data.client_secret;
    connector.aad_url = data.aad_url;
    connector.graph_url = data.graph_url;
    connector.tenant_id = data.tenant_id;
    connector.user_id = data.user_id;
    try {
      await this.connectorsRepository.save(connector);
    } catch (error) {
      status = {
        success: false,
        message: error,
      };
    }

    return status;
  }
}

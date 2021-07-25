import { LoggerModule } from 'nestjs-pino';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ConfigService } from '../config/config.service';
import { Connectors } from '../db/entities/connectors.entity';
import { UtilsService } from '../utils/utils.service';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { GetConnectorsById } from './dto/get-connectors-by-id.dto';
import { CreateConnectorsDto } from './dto/create-connectors.dto';
import { CreateConnectorStatus } from '../../dist/connectors/interfaces/create-connector-status.interface';

describe('ConnectorsController', () => {
  let controller: ConnectorsController;
  let service: ConnectorsService;
  const getConnectorsById: GetConnectorsById = {
    userId: null,
    id: '3b6b451e-df59-490c-92d1-6600515ce155',
  };
  const reqFake = {
    user: {
      userId: '3b6b451f-df59-490c-92d1-6600515ce172',
    },
  };
  const connectorsData = [
    {
      id: '3b6b451e-df59-490c-92d1-6600515ce155',
      name: 'office365',
      userId: '3b6b451f-df59-490c-92d1-6600515ce177',
      connectionData: {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        tenantId: 'tenantId',
        aadUrl: 'aadUrl',
        graphUrl: 'graphUrl',
        type: 'office365',
      },
    },
  ];
  const connector: CreateConnectorsDto = {
    name: 'office365',
    userId: '3b6b451f-df59-490c-92d1-6600515ce177',
    connectionData: {
      clientId: 'client_id',
      clientSecret: 'client_secret',
      tenantId: 'tenant_id',
      aadUrl: 'aad_endpoint',
      graphUrl: 'graph_endpoint',
      type: 'office365',
    },
  };
  const successMessage: CreateConnectorStatus = {
    message: 'connector created',
    success: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectorsController],
      imports: [LoggerModule.forRoot()],
      providers: [
        ConnectorsService,
        UtilsService,
        ConfigService,
        {
          provide: getRepositoryToken(Connectors),
          useValue: {
            findOneOrFail: jest.fn().mockImplementation(
              (data: GetConnectorsById) =>
                new Promise((resolve, reject) => {
                  if (
                    (!data && !data.id && !data.userId) ||
                    data.userId !== connectorsData[0].userId
                  ) {
                    reject(new BadRequestException('Wrong data in payload'));
                  }
                  resolve(connectorsData[0]);
                }),
            ),
            save: jest.fn().mockReturnValue(successMessage),
            find: jest.fn().mockImplementation(
              (data: GetConnectorsById) =>
                new Promise((resolve, reject) => {
                  if (
                    (!data && !data.id && !data.userId) ||
                    data.userId !== connectorsData[0].userId
                  ) {
                    reject(new BadRequestException('Wrong data in payload'));
                  }
                  resolve(connectorsData);
                }),
            ),
          },
        },
      ],
    }).compile();
    controller = module.get<ConnectorsController>(ConnectorsController);
    service = module.get<ConnectorsService>(ConnectorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  describe('get connectors', () => {
    it('should find connector by id of user', async () => {
      expect(
        await controller.getConnectorsById(getConnectorsById, reqFake),
      ).toEqual(connectorsData[0]);
    });
    it('should create a connector', async () => {
      expect(await controller.createConnector(reqFake, connector)).toEqual(
        successMessage,
      );
    });
    it('should retrieve all connector of user', async () => {
      expect(await controller.getAllConnectors(reqFake)).toEqual(
        connectorsData,
      );
    });
    it('should not find any connector of user with no connector id', async (done) => {
      try {
        await controller.getConnectorsById(null, reqFake);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Wrong data in payload');
        expect(error.status).toBe(400);
        done();
      }
    });
  });
});

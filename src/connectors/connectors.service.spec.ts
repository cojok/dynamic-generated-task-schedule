import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConnectorsService } from './connectors.service';
import { UtilsService } from '../utils/utils.service';
import { Connectors } from '../db/entities/connectors.entity';
import { ConfigService } from '../config/config.service';

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  }),
);
export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

describe('ConnectorsService', () => {
  let service: ConnectorsService;
  // let clientRepositoryMock: MockType<Repository<Connectors>>;
  // let clientTypeRepositoryMock: MockType<Repository<Connectors>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectorsService,
        UtilsService,
        ConfigService,
        {
          provide: getRepositoryToken(Connectors),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ConnectorsService>(ConnectorsService);
    // clientRepositoryMock = module.get(getRepositoryToken(Connectors));
    // clientTypeRepositoryMock = module.get(getRepositoryToken(Connectors));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

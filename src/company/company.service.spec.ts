import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from '../db/entities/company.entity';
import { ConfigService } from '../config/config.service';
import { UtilsService } from '../utils/utils.service';

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

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        UtilsService,
        ConfigService,
        {
          provide: getRepositoryToken(Company),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

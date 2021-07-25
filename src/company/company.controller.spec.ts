import { LoggerModule } from 'nestjs-pino/dist';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { Status } from '../shared/interfaces/status.interface';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { User } from '../db/entities/user.entity';
import { UserService } from '../user/user.service';
import { Company } from '../db/entities/company.entity';
import { UtilsService } from '../utils/utils.service';
import { ConfigService } from '../config/config.service';
import { CreateCompanyDto } from './dto/create-company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;
  const companyData: CreateCompanyDto = {
    name: 'companyName',
    phone: 111212345678901,
    accountStatus: 'active',
    planId: 'planId',
    paymentId: 'paymentId',
    address: {
      street: 'street',
      houseNumber: '12a',
      zipCode: '65432',
      city: 'München',
      county: 'Bayern',
      country: 'Germany',
    },
  };
  const reqFake = {
    user: {
      userId: '3b6b451f-df59-490c-92d1-6600515ce177',
    },
  };
  const companyReturnData = {
    id: '3b6b451f-df59-490c-92d1-6600515ce187',
    name: 'companyName',
    phone: 111212345678901,
    accountStatus: 'active',
    planId: 'planId',
    paymentId: 'paymentId',
    address: {
      street: 'street',
      houseNumber: '12a',
      zipCode: '65432',
      city: 'München',
      county: 'Bayern',
      country: 'Germany',
    },
  };
  const successMessage: Status = {
    message: 'company created successfully',
    success: true,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      imports: [LoggerModule.forRoot()],
      providers: [
        CompanyService,
        UserService,
        UtilsService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            save: jest.fn().mockReturnValue(successMessage),
            findOneOrFail: jest.fn().mockImplementation(
              (data) =>
                new Promise((resolve, reject) => {
                  if (!data) {
                    reject(new BadRequestException('Wrong payload'));
                  }
                  resolve(companyReturnData);
                }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  it('should create company', async () => {
    expect(await controller.create(companyData)).toEqual(successMessage);
  });
  it('should return company for user', async () => {
    expect(await controller.findOne('test', reqFake)).toBe(companyReturnData);
  });
  it('should not return any company for user', async () => {
    try {
      await controller.findOne('test', null);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});

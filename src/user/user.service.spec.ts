import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { UtilsService } from '../utils/utils.service';
import { UserService } from './user.service';
import { User } from '../db/entities/user.entity';
import { GetUserByIdDto } from './dto/index.dto';

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

describe('UserService', () => {
  let service: UserService;
  let utilsService: UtilsService;
  let clientRepositoryMock: MockType<Repository<User>>;
  let clientTypeRepositoryMock: MockType<Repository<User>>;
  const userData = [
    {
      name: 'Flave',
      id: '3b6b451f-df59-490c-92d1-6600515ce177',
      password:
        '6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50',
      username: 'flavflavour',
      email: 'falve@flavour.com',
      created: '2021-07-24',
      updatedAt: '2021-07-24',
    },
    {
      name: 'Flave 2',
      id: '3b6b451f-df59-490c-92d1-6600515ce177',
      password:
        '6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e51',
      username: 'flavflavour2',
      email: 'falve2@flavour.com',
      created: '2021-07-24',
      updatedAt: '2021-07-24',
    },
  ];

  const user: User = new User();
  user.email = userData[0].email;
  user.name = userData[0].name;
  user.username = userData[0].username;
  user.password = userData[0].password;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: UtilsService,
          // useFactory: utilsServiceMockFactory,
          useValue: {
            hashPassword: jest.fn().mockImplementation((password: string) => {
              return password;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    clientRepositoryMock = module.get(getRepositoryToken(User));
    clientTypeRepositoryMock = module.get(getRepositoryToken(User));
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(utilsService).toBeDefined();
  });

  it('should create new user', async () => {
    clientTypeRepositoryMock.save.mockReturnValue(userData[0]);
    expect(await service.createUser(user)).toEqual(userData[0]);
    expect(clientRepositoryMock.save).toBeCalledTimes(1);
    expect(clientRepositoryMock.save).toBeCalledWith(user);
  });

  it('should retrieve all users', async () => {
    clientTypeRepositoryMock.find.mockReturnValue(userData);
    expect(await service.findAll()).toEqual(userData);
    expect(clientRepositoryMock.find).toBeCalledTimes(1);
    expect(clientRepositoryMock.find).toBeCalledWith();
  });

  describe('Get 1 user from DB', () => {
    const data: GetUserByIdDto = {
      id: '3b6b451f-df59-490c-92d1-6600515ce177',
    };
    it('should retrieve a user', async () => {
      clientTypeRepositoryMock.findOneOrFail.mockImplementation(
        (data1: GetUserByIdDto) =>
          new Promise((resolve, reject) => {
            if (!data1 || data1.id !== '3b6b451f-df59-490c-92d1-6600515ce177') {
              reject(new Error('No data send in'));
            }
            resolve(userData[0]);
          }),
      );
      expect(await service.findOne(data)).toEqual(userData[0]);
      expect(clientRepositoryMock.findOneOrFail).toBeCalledTimes(1);
      expect(clientRepositoryMock.findOneOrFail).toBeCalledWith(data);
    });

    it('should fail to retrieve a user', async (done) => {
      clientTypeRepositoryMock.findOneOrFail.mockImplementation(
        (data2: GetUserByIdDto) =>
          new Promise((resolve, reject) => {
            if (!data2 || data2.id !== '3b6b451f-df59-490c-92d1-6600515ce177') {
              reject(new Error('No data send in'));
            }
            resolve(userData[0]);
          }),
      );
      await service.findOne(null).catch((error) => {
        expect(error).toEqual(new Error('No data send in'));
        done();
      });
      expect(clientRepositoryMock.findOneOrFail).toBeCalledTimes(1);
      expect(clientRepositoryMock.findOneOrFail).toBeCalledWith(null);
    });
  });
});

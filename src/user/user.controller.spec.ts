import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../db/entities/user.entity';
import { UtilsService } from '../utils/utils.service';
import { ConfigService } from '../config/config.service';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const user: GetUserByIdDto = {
    id: '3b6b451f-df59-490c-92d1-6600515ce177',
  };
  const userReturn = {
    name: 'Flave',
    id: '3b6b451f-df59-490c-92d1-6600515ce177',
    password:
      '6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50',
    username: 'flavflavour',
    email: 'falve@flavour.com',
    created: '2021-07-24',
    updatedAt: '2021-07-24',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UtilsService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneOrFail: jest.fn().mockImplementation(
              (data: GetUserByIdDto) =>
                new Promise((resolve, reject) => {
                  if (
                    !data ||
                    data.id !== '3b6b451f-df59-490c-92d1-6600515ce177'
                  ) {
                    reject(new Error('No data send in'));
                  }
                  resolve(userReturn);
                }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('get user', () => {
    it('should return user data', async () => {
      expect(await controller.getProfile(user)).toEqual(userReturn);
    });
    it('should return bad request exception', async (done) => {
      try {
        await controller.getProfile(null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error).toEqual(
          new BadRequestException('Incorrect data provided'),
        );
        expect(error.status).toBe(400);
        done();
      }
    });
    it('should return not found', async (done) => {
      await controller
        .getProfile({ id: 'test' })
        .then(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          done.fail('Client controller should return not found exception'),
        )
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('No user found'));
          expect(error.status).toBe(404);
          done();
        });
    });
  });
});

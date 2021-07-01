import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';
import { UtilsService } from '../utils/utils.service';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserByIdDto,
  GetUserByUsernameDto,
} from './dto/index.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private utilsService: UtilsService,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const hashPassword: string = await this.utilsService.hashPassword(
      data.password,
    );
    const user: User = new User();
    user.email = data.email;
    user.name = data.name;
    user.username = data.username;
    user.password = hashPassword;
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(data: GetUserByIdDto): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne(data);
    return user;
  }

  async delete(data: DeleteUserDto): Promise<boolean> {
    const hashPassword: string = await this.utilsService.hashPassword(
      data.password,
    );
    const result: DeleteResult = await this.userRepository.delete({
      email: data.email,
      id: data.id,
      password: hashPassword,
    });
    return !!result.affected;
  }

  async findUserByUsername(data: GetUserByUsernameDto): Promise<User> {
    return this.userRepository.findOne({ username: data.username });
  }

  async findUserBy(data): Promise<User> {
    return this.userRepository.findOne(data);
  }
}

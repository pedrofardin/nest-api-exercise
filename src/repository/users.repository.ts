import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/modules/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/modules/users/dtos/update-user.dto';
import { IUsersRepository } from './users-repository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  createUser = async (user: CreateUserDTO): Promise<UserEntity> => {
    try {
      const newUser = new UserEntity();

      newUser.id = randomUUID().toString();
      newUser.name = user.name;
      newUser.password = user.password;
      newUser.email = user.email;
      newUser.birthdate = user.birthdate;

      return this._userRepository.save(newUser);
    } catch {
      throw new BadRequestException('Failed to create a new User');
    }
  };

  findUserById = async (id: string): Promise<UserEntity> => {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User whith ${id} not found`);
    }
    return user;
  };

  findUserByEmail = async (email: string): Promise<UserEntity> => {
    const user = await this._userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User whith ${email} not found`);
    }
    return user;
  };

  findUsers = async (): Promise<UserEntity[]> => {
    const users = await this._userRepository.find();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  };

  updateUser = async (id: string, user: UpdateUserDTO): Promise<UserEntity> => {
    const updatedUser = await this._userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    updatedUser.name = user.name;
    updatedUser.email = user.email;
    updatedUser.password = user.password;

    return await this._userRepository.save(updatedUser);
  };

  updateUserBalance = async (
    id: string,
    quantity: number,
  ): Promise<UserEntity> => {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.balance = Number(user.balance) + quantity;
    if (user.balance < 0) {
      throw new BadRequestException('Not enough balance to transfer');
    }

    await this._userRepository.save(user);

    return user;
  };

  removeUser = async (id: string): Promise<void> => {
    const deleteResult = await this._userRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  };
}

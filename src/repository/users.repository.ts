import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/modules/users/dtos/create-user.dto';
import { GetUserDTO } from 'src/modules/users/dtos/get-users.dto';
import { UpdateUserDTO } from 'src/modules/users/dtos/update-user.dto';
import { IUsersRepository } from './users-repository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatedUserBalanceDTO } from 'src/modules/users/dtos/update-user-balance.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>
  ) {}

  createUser = async (user: CreateUserDTO): Promise<CreateUserDTO> => {
    const newUser = new UserEntity();

    newUser.id = randomUUID().toString();
    newUser.name = user.name;
    newUser.password = user.password;
    newUser.email = user.email;
    newUser.balance = user.balance;

    return this._userRepository.save(newUser);
  };

  findUserById = async (id: string): Promise<GetUserDTO> => {
    return await this._userRepository.findOne({ where: { id } });
  };

  findUserByEmail = async (email: string): Promise<GetUserDTO> => {
    return await this._userRepository.findOne({ where: { email } });
  };

  findUsers = async (): Promise<GetUserDTO[]> => {
    return await this._userRepository.find();
  };

  updateUser = async (
    id: string,
    user: UpdateUserDTO,
  ): Promise<UpdateUserDTO> => {
    const updatedUser = await this._userRepository.findOne({ where: { id } });

    if (!user) {
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
  ): Promise<UpdatedUserBalanceDTO> => {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.balance = Number(user.balance) + quantity;

    await this._userRepository.save(user);

    const UpdatedUserBalance: UpdatedUserBalanceDTO = {
      name: user.name,
      email: user.email,
      balance: user.balance,
    };

    return UpdatedUserBalance;
  };

  removeUser = async (id: string): Promise<void> => {
    const deleteResult = await this._userRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  };
}

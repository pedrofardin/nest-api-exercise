import { Inject, Injectable } from '@nestjs/common';
import { GetUserDTO } from '../dtos/get-user.dto';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { IUsersRepository } from 'src/repository/users-repository.interface';
import { IUsersService } from './users-service.interface';
import { TransferMoneyBetweenUsersDTO } from '../dtos/transfer-money-between-users.dto';
import { UsersRepository } from 'src/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { GetUsersDTO } from '../dtos/get-users.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(UsersRepository) private readonly _userRepository: IUsersRepository,
  ) {}

  createUser = async (user: CreateUserDTO): Promise<CreateUserDTO> => {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    const newUser = await this._userRepository.createUser({
      ...user,
      password: hashedPassword,
    });

    return newUser;
  };

  findUser = async (id: string): Promise<GetUserDTO> => {
    return await this._userRepository.findUserById(id);
  };

  findUsers = async (): Promise<GetUsersDTO[]> => {
    return await this._userRepository.findUsers();
  };

  updateUser = async (
    id: string,
    user: UpdateUserDTO,
  ): Promise<UpdateUserDTO> => {
    return await this._userRepository.updateUser(id, user);
  };

  removeUser = async (id: string): Promise<void> => {
    return await this._userRepository.removeUser(id);
  };

  transferMoneyBetweenUsers = async (
    dataTransfer: TransferMoneyBetweenUsersDTO,
  ): Promise<string> => {
    const user1 = await this._userRepository.findUserById(dataTransfer.from);
    const user2 = await this._userRepository.findUserById(dataTransfer.to);

    const quantity = Number(dataTransfer.quantity);

    await this._userRepository.updateUserBalance(user1.id, -quantity);
    await this._userRepository.updateUserBalance(user2.id, quantity);

    return 'A transferência foi realizada com sucesso.';
  };
}

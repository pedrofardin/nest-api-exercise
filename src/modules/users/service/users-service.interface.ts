import { CreateUserDTO } from '../dtos/create-user.dto';
import { GetUsersDTO } from '../dtos/get-users.dto';
import { GetUserDTO } from '../dtos/get-user.dto';
import { TransferMoneyBetweenUsersDTO } from '../dtos/transfer-money-between-users.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';

export interface IUsersService {
  createUser(user: CreateUserDTO): Promise<CreateUserDTO>;
  findUser(id: string): Promise<GetUserDTO>;
  findUsers(): Promise<GetUsersDTO[]>;
  updateUser(id: string, user: UpdateUserDTO): Promise<UpdateUserDTO>;
  transferMoneyBetweenUsers(
    dataTransfer: TransferMoneyBetweenUsersDTO,
  ): Promise<string>;
}

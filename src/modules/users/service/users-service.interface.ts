import { CreateUserDTO } from '../dtos/create-user.dto';
import { GetUserDTO } from '../dtos/get-users.dto';
import { TransferMoneyBetweenUsersDTO } from '../dtos/transfer-money-between-users.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserLoginDTO } from '../dtos/user-login.dto';

export interface IUsersService {
  createUser(user: CreateUserDTO): Promise<CreateUserDTO>;
  findUser(id: string): Promise<GetUserDTO>;
  findUsers(): Promise<GetUserDTO[]>;
  updateUser(id: string, user: UpdateUserDTO): Promise<UpdateUserDTO>;
  transferMoneyBetweenUsers(
    dataTransfer: TransferMoneyBetweenUsersDTO,
  ): Promise<string>;
}

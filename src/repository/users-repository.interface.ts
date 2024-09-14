import { CreateUserDTO } from 'src/modules/users/dtos/create-user.dto';
import { GetUserDTO } from 'src/modules/users/dtos/get-users.dto';
import { UpdatedUserBalanceDTO } from 'src/modules/users/dtos/update-user-balance.dto';
import { UpdateUserDTO } from 'src/modules/users/dtos/update-user.dto';

export interface IUsersRepository {
  createUser(user: CreateUserDTO): Promise<CreateUserDTO>;
  findUsers(): Promise<GetUserDTO[]>;
  findUserById(id: string): Promise<GetUserDTO>;
  findUserByEmail(email: string): Promise<GetUserDTO>;
  updateUser(id: string, user: UpdateUserDTO): Promise<UpdateUserDTO>;
  removeUser(id: string): Promise<void>;
  updateUserBalance(
    id: string,
    quantity: number,
  ): Promise<UpdatedUserBalanceDTO>;
}

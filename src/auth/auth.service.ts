import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/repository/users.repository';
import { IUsersRepository } from 'src/repository/users-repository.interface';
import { UserLoginDTO } from 'src/modules/users/dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository) private readonly _usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: UserLoginDTO): Promise<{ accessToken: string }> {
    const user = await this._usersRepository.findUserByEmail(login.email);

    if (user && (await bcrypt.compare(login.password, user.password))) {
      const ticket = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(ticket),
      };
    }

    return null;
  }
}

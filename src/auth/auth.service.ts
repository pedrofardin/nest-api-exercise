import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/repository/users/users.repository';
import { IUsersRepository } from 'src/repository/users/users-repository.interface';
import { UserLoginDTO } from 'src/modules/users/dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: UserLoginDTO): Promise<{ token: string }> {
    const user = await this._usersRepository.findUserByEmail(login.email);

    if (user && (await bcrypt.compare(login.password, user.password))) {
      const ticket = { sub: user.id };
      return {
        token: this.jwtService.sign(ticket),
      };
    }

    throw new UnauthorizedException('invalid credentials');
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { UserLoginDTO } from 'src/modules/users/dtos/user-login.dto';
import { IUsersRepository } from 'src/repository/users-repository.interface';
import { UsersRepository } from 'src/repository/users.repository';
import { JwtTicketDTO } from 'src/shared/dto/jwt-ticket.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UsersRepository) private readonly _usersRepository: IUsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(ticket: JwtTicketDTO): Promise<UserLoginDTO> {
    const user = await this._usersRepository.findUserById(ticket.sub);

    if (!user) {
      return null;
    }

    const userLoginDto: UserLoginDTO = {
      email: user.email,
      password: user.password
    };

    return userLoginDto;
  }
}

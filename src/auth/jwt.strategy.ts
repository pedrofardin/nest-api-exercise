import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { IUsersRepository } from 'src/repository/users-repository.interface';
import { UsersRepository } from 'src/repository/users.repository';
import { JwtTicketDTO } from 'src/shared/dto/jwt-ticket.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(ticket: JwtTicketDTO) {
    const user = await this._usersRepository.findUserById(ticket.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    return user;
  }
}

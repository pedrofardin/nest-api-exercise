import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Request } from 'express';
import { UsersRepository } from 'src/repository/users/users.repository';
import { IUsersRepository } from 'src/repository/users/users-repository.interface';
import { JwtTicketDTO } from '../dto/jwt-ticket.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(UsersRepository) private readonly _userRepository: IUsersRepository 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: JwtTicketDTO = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const user = await this._userRepository.findUserById(payload.id);
      request['user'] = {id: user.id};
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

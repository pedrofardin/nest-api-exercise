import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersControllerModule } from '../modules/users/controller/user-controller.module';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { UsersRepositoryModule } from 'src/repository/users-repository.module';

@Module({
  imports: [
    UsersRepositoryModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
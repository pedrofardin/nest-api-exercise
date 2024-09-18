import { Module } from '@nestjs/common';
import { UsersServiceModule } from '../service/users-service.module';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepositoryModule } from 'src/repository/users/users-repository.module';

@Module({
  imports: [UsersServiceModule, AuthModule, UsersRepositoryModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}

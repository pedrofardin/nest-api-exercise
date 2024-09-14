import { Module } from '@nestjs/common';
import { UsersServiceModule } from '../service/users-service.module';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersServiceModule, AuthModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepositoryModule } from 'src/repository/users-repository.module';

@Module({
  imports: [UsersRepositoryModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersServiceModule {}

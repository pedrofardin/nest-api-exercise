import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersRepositoryModule {}

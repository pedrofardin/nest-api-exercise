import { Module } from '@nestjs/common';
import { UsersController } from './modules/users/controller/users.controller';
import { UsersService } from './modules/users/service/users.service';
import { DatabaseModule } from './infra/database.module';
import { UsersControllerModule } from './modules/users/controller/user-controller.module';
import { UsersRepositoryModule } from './repository/users/users-repository.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UsersControllerModule,
    UsersRepositoryModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}

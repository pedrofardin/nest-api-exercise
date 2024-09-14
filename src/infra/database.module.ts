import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          entities: [join(__dirname + '/../entities/*.entity{.ts,.js}')],
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

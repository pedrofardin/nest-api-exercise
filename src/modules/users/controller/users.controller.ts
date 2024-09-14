import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { GetUserDTO } from '../dtos/get-users.dto';
import { IUsersService } from '../service/users-service.interface';
import { TransferMoneyBetweenUsersDTO } from '../dtos/transfer-money-between-users.dto';
import { UsersService } from '../service/users.service';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDTO } from '../dtos/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly _usersService: IUsersService,
    @Inject(AuthService) private readonly _authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() createUser: CreateUserDTO,
    @Res() res: Response<CreateUserDTO>,
  ) {
    const response = await this._usersService.createUser(createUser);
    return res.status(HttpStatus.CREATED).send(response);
  }

  @Post('/signin')
  async signIn(
    @Body() login: UserLoginDTO,
    @Res() res: Response
  ){
    const user = await this._authService.signIn(login) 
    if (!user) throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    return res.status(HttpStatus.OK).json(user)
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsers(@Res() res: Response<GetUserDTO[]>) {
    const response = await this._usersService.findUsers();
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getUser(
    @Param('userId') userId: string,
    @Res() res: Response<GetUserDTO>,
  ) {
    const response = await this._usersService.findUser(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/transfer')
  async transferMoney(
    @Body() transfer: TransferMoneyBetweenUsersDTO,
    @Res() res: Response<string>,
  ) {
    const response =
      await this._usersService.transferMoneyBetweenUsers(transfer);
    return res.status(HttpStatus.CREATED).json(response);
  }
}

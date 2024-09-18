import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { GetUserDTO } from '../dtos/get-user.dto';
import { IUsersService } from '../service/users-service.interface';
import { TransferMoneyBetweenUsersDTO } from '../dtos/transfer-money-between-users.dto';
import { UsersService } from '../service/users.service';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDTO } from '../dtos/user-login.dto';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { GetUsersDTO } from '../dtos/get-users.dto';
import { JwtTicketDTO } from 'src/shared/dto/jwt-ticket.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly _usersService: IUsersService,
    @Inject(AuthService) private readonly _authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() req: Request, @Res() res: Response<CreateUserDTO>) {
    const request = plainToClass(CreateUserDTO, req);
    const validateErrors = await validate(request);
    if (validateErrors.length) {
      throw new BadRequestException(validateErrors);
    }

    const response = await this._usersService.createUser(request);
    return res.status(HttpStatus.CREATED).send(response);
  }

  @Post('/signin')
  async signIn(@Body() login: UserLoginDTO, @Res() res: Response) {
    const user = await this._authService.signIn(login);
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    return res.status(HttpStatus.OK).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsers(@Res() res: Response<GetUsersDTO[]>) {
    const response = await this._usersService.findUsers();
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getUser(
    @Param('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response<GetUserDTO>,
  ) {
    const user = req['user'] as JwtTicketDTO;

    if (user.sub !== userId) {
      throw new BadRequestException(
        'You can only access your own user information',
      );
    }
    const response = await this._usersService.findUser(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/transfer')
  async transferMoney(
    @Body() transfer: TransferMoneyBetweenUsersDTO,
    @Req() req: Request,
    @Res() res: Response<string>,
  ) {
    const user = req['user'];
    if (user.sub !== transfer.from) {
      throw new BadRequestException(
        'You can only transfer from your own balance',
      );
    }
    const response =
      await this._usersService.transferMoneyBetweenUsers(transfer);
    return res.status(HttpStatus.CREATED).json(response);
  }
}

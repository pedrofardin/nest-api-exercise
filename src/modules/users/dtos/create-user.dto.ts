import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import * as moment from 'moment';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @Transform(({ value }) => moment(value, 'YYYY/MM/DD').format('YYYY-MM-DD'))
  // isminor decorate.
  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  birthdate: string;
}

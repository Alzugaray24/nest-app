import {
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  Max,
  Length,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @IsIn(['PUBLIC', 'USER', 'USER_PREMIUM', 'ADMIN'])
  role: string;
}

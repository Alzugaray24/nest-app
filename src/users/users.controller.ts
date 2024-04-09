import {
  Get,
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from '../utils/cryptography';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/users')
export class UsersController {
  cryptoService = new CryptoService();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getAllUsers(@Res() res) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Usuarios obtenidos con éxito',
        users: users,
      });
    } catch (error) {
      throw new HttpException(
        { error: 'Error interno del servidor al obtener los usuarios' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException(
          { error: 'Usuario no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      return res.status(HttpStatus.OK).json({
        message: 'Usuario obtenido con éxito',
        user: user,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { error: 'Error interno del servidor al obtener el usuario' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, age, password } = createUserDto;

      if (!firstName || !lastName || !email || !age || !password) {
        throw new HttpException(
          {
            error:
              'Los campos first_name, last_name, email, age y password son requeridos',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new HttpException(
          { error: 'Formato de correo electrónico inválido' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isNaN(age) || age < 0 || age > 120) {
        throw new HttpException(
          { error: 'La edad debe ser un número válido entre 0 y 120' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = this.cryptoService.createHash(password);

      const newUser = await this.usersService.create({
        firstName,
        lastName,
        email,
        age,
        password: hashedPassword,
        role: 'user',
      });

      return {
        status: 'Usuario creado con éxito',
        usuario: newUser,
      };
    } catch (error) {
      throw new HttpException(
        { error: 'Error interno del servidor al registrar el usuario' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res) {
    try {
      const { email, password } = loginUserDto;

      if (!email || !password) {
        throw new HttpException(
          { error: 'Se requieren correo electrónico y contraseña.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersService.loginUser(email, password);

      if (!user) {
        throw new HttpException(
          { error: 'Correo electrónico o contraseña incorrectos.' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = this.jwtService.sign({ email: user.email, sub: user._id });

      return res.status(HttpStatus.OK).json({
        status: 'Sesión iniciada',
        token: token,
      });
    } catch (error) {
      throw new HttpException(
        { error: 'Error interno del servidor al iniciar sesión' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      if (!id || !updateUserDto) {
        throw new HttpException(
          {
            error:
              'Se requiere un ID de usuario y datos de actualización válidos.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar que todos los campos en updateUserDto estén completos
      const fields = Object.keys(updateUserDto);
      if (fields.some((field) => !updateUserDto[field])) {
        throw new HttpException(
          {
            error:
              'Todos los campos en los datos de actualización deben estar completos.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Realizar validaciones adicionales según sea necesario

      const updatedUser = await this.usersService.update(id, updateUserDto);
      return {
        status: 'Success',
        usuarioActualizado: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        { error: 'Error interno del servidor al actualizar usuario' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const existingUser = await this.usersService.findOne(id);
      if (!existingUser) {
        throw new Error('El usuario no existe');
      }
      await this.usersService.remove(id);
      return {
        status: 'success',
        message: `Usuario ${existingUser.firstName} ${existingUser.lastName} eliminado con éxito`,
      };
    } catch (error) {
      throw new HttpException(
        { error: 'Error interno del servidor al eliminar usuario' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

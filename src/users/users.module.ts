import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/users.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: 'coderHouse', // Aquí deberías usar una clave secreta segura
      signOptions: { expiresIn: '1d' }, // Opciones de firma del JWT
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

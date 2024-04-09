import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  // Función para crear el hash de una contraseña
  createHash(password: string): string {
    const saltRounds = 10; // Número de rondas de sal
    return bcrypt.hashSync(password, saltRounds);
  }

  // Función para verificar si una contraseña es válida
  isValidPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

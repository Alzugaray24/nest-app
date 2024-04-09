import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UsersDocument } from './schema/users.schema';
import { CryptoService } from '../utils/cryptography';

@Injectable()
export class UsersService {
  cryptoService = new CryptoService();

  constructor(
    @InjectModel(User.name) private userModel: Model<UsersDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UsersDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UsersDocument> {
    return this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersDocument> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<UsersDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  loginUser = async (
    email: string,
    password: string,
  ): Promise<UsersDocument | null> => {
    try {
      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        return null;
      }

      const userPassword = user.password;

      const isValid = this.cryptoService.isValidPassword(
        password,
        userPassword,
      );
      if (!isValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in loginUser:', error);
      throw error;
    }
  };
}

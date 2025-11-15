import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }
  
  async create(createUserDto: CreateUserDto) {
    console.log("Creating user:", createUserDto);
        const userData = await this.userModel.findOne({username:createUserDto.username});
        if (userData) {
            throw new UnauthorizedException('Invalid username');
        }
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(createUserDto.password, saltRounds);
        const Data = {
          username: createUserDto.username,
          password: hashedPassword,
          role: createUserDto.role || 'user',
        }
    const user = new this.userModel(Data);
    return user.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

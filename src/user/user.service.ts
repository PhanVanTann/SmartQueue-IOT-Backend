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

  async findAll() {
    const users = await this.userModel.find({role:'user'}).select('-password'); 
    return {message:'success','data':users};
  }
  

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { message: 'success', data: user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const updateData: any = { ...updateUserDto };
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }
    
    const updated = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    return { message: 'User updated successfully', data: updated };
  }

  async remove(id: string) {
     await this.userModel.findByIdAndDelete(id);
     return { message: 'User deleted successfully' };
  }
}

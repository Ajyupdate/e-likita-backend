import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDocument> {
    const doc = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('User not found');
  }
}

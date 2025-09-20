import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    return this.signUser(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.signUser(user);
  }

  private signUser(user: any) {
    const payload = { 
      sub: user._id.toString(), 
      email: user.email, 
      role: user.role 
    };
    const token = this.jwtService.sign(payload);
    
    // Return both token and user details (excluding password)
    return { 
      access_token: token,
      user: {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        profile: user.profile || {}
      }
    };
  }
}

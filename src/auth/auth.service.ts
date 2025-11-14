import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
 async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    console.log("Validating user:", user);
    //await bcrypt.compare(password, user.password
    if (user && password === user.password) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
   async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    console.log("Authenticated user:", user);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  
}
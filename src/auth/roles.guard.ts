import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Token Format');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; 
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = request.user;

    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can perform this action');
    }

    return true;
  }
} 
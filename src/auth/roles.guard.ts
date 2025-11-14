import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user; 

    if (!user) throw new ForbiddenException("User not found in request");

    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can perform this action');
    }

    return true;
  }
}
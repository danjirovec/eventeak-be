import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    try {
      const token = this.getToken(request);
      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.userId = user.sub;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  protected getToken(request: { headers: Record<string, string> }): string {
    const token = request.headers['authorization'];
    const [_, _token] = token.split(' ');
    return _token;
  }
}

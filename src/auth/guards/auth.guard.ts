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
    console.log('CONTEXT', ctx.getContext());
    const request = ctx.getContext().req;
    try {
      console.log('REQUEST', request);
      const token = this.getToken(request);
      console.log('TOKEN', token);
      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.log('USER', user);
      request.userId = user.sub;
      return true;
    } catch (error) {
      console.log('ERROR', error);
      throw new UnauthorizedException();
    }
  }

  protected getToken(request: { headers: Record<string, string> }): string {
    console.log('HEADERS', request.headers);
    const token = request.headers['authorization'];
    console.log('TOKEN BEFORE SPLIT', token);
    const [_, _token] = token.split(' ');
    return _token;
  }
}

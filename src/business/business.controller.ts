import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('invite')
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async sendInvite(@Body() body: { email: string; business: string }) {
    await this.businessService.sendInvite(body.email, body.business);
    return { status: 'OK' };
  }

  @Get()
  async createBusinessUser(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    await this.businessService.createBusinessUser(token);
    const env = this.configService.get<string>('ENVIRONMENT');
    const redirectUrl = this.configService.get<string>('CLIENT_URL');
    return res.redirect(`${redirectUrl}/login`);
  }
}

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

@Controller('invite')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Post()
  @UseGuards(AuthGuard)
  async inviteUser(@Body() body: { email: string; business: string }) {
    await this.businessService.sendInvite(body.email, body.business);
    return { status: 'OK' };
  }

  @Get()
  async createBusinessUser(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    await this.businessService.createBusinessUser(token);
    return res.redirect('http://localhost:5173/login');
  }
}

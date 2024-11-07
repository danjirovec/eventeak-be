import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessUser } from 'src/business.user/business.user.entity/business.user.entity';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { BusinessUserDto } from 'src/business.user/business.user.dto/business.user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { Role } from 'src/enum/enum';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity/user.entity';
import { UserDto } from 'src/user/user.dto/user.dto';
import { Business } from './business.entity/business.entity';
import { BusinessDto } from './business.dto/business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectQueryService(Business)
    readonly businessService: QueryService<BusinessDto>,
    @InjectQueryService(User)
    readonly userService: QueryService<UserDto>,
    @InjectQueryService(BusinessUser)
    readonly businessUserService: QueryService<BusinessUserDto>,
    readonly jwtService: JwtService,
    readonly mailService: MailService,
    readonly configService: ConfigService,
  ) {}

  async sendInvite(email: string, businessId: string) {
    const user = await this.userService.query({
      filter: { email: { eq: email } },
      paging: { limit: 1 },
    });

    if (!user.length) {
      throw new BadRequestException('User with this email does not exist');
    }
    try {
      const business = await this.businessService.getById(businessId);
      const token = this.jwtService.sign(
        { user: user[0].id, business: businessId },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '365d',
        },
      );
      this.mailService.sendInvite(
        token,
        email,
        business.name,
        user[0].firstName,
        user[0].lastName,
      );
    } catch (error) {
      throw error;
    }
    return;
  }

  async createBusinessUser(token: string) {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const businessUser = await this.businessUserService.query({
        filter: {
          and: [
            { userId: { eq: decoded.user } },
            { businessId: { eq: decoded.business } },
            { role: { eq: Role.Admin } },
          ],
        },
      });

      if (businessUser) {
        return;
      }

      await this.businessUserService.createOne({
        businessId: decoded.business,
        userId: decoded.user,
        role: Role.Admin,
      });
    } catch (error) {
      throw error;
    }
    return;
  }
}

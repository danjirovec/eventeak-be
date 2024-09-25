import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(readonly mailerService: MailerService) {}

  async sendInvite(
    token: string,
    email: string,
    business: string,
    firstName: string,
    lastName: string,
  ) {
    const url = `http://localhost:3000/invite?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Applausio" <jird12@vse.cz>',
      subject: 'Invitation to manage a business',
      template: './invite',
      context: {
        name: `${firstName} ${lastName}`,
        url,
        business,
      },
    });
  }
}

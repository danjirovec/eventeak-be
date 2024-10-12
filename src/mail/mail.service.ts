import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private inviteTemplate: handlebars.TemplateDelegate;
  private passwordResetTemplate: handlebars.TemplateDelegate;
  private groupInviteTemplate: handlebars.TemplateDelegate;
  constructor(
    readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport(
      {
        host: this.configService.get<string>('MAIL_HOST'),
        secure: process.env.MAILER_SECURE === 'true',
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      },
      {
        from: {
          name: 'No-reply',
          address: this.configService.get<string>('MAIL_FROM'),
        },
      },
    );

    this.inviteTemplate = this.loadTemplate('invite.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, './templates');
    const templatePath = path.join(templatesFolderPath, templateName);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  }

  async sendInvite(
    token: string,
    email: string,
    business: string,
    firstName: string,
    lastName: string,
  ) {
    const url = `http://localhost:3000/invite?token=${token}`;
    const html = this.inviteTemplate({
      name: `${firstName} ${lastName}`,
      url,
      business,
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Invitation to manage a business',
      html: html,
    });
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/user/user.dto/user.dto';
import { BusinessDto } from 'src/business/business.dto/business.dto';
import { MembershipDto } from 'src/membership/membership.dto/membership.dto';
import { MembershipTypeDto } from 'src/membership.type/membership.type.dto/membership.type.dto';

const formatEventDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', ' -');
};

const formatExpiryDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  }).format(date);
};

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private inviteTemplate: handlebars.TemplateDelegate;
  private userTemplate: handlebars.TemplateDelegate;
  private ticketsTemplate: handlebars.TemplateDelegate;
  private membershipTemplate: handlebars.TemplateDelegate;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        from: 'Eventeak',
        host: this.configService.get<string>('MAIL_HOST'),
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      },
      {
        from: {
          name: 'Eventeak',
          address: this.configService.get<string>('MAIL_FROM'),
        },
      },
    );

    this.inviteTemplate = this.loadTemplate('invite.hbs');
    this.userTemplate = this.loadTemplate('user.hbs');
    this.ticketsTemplate = this.loadTemplate('tickets.hbs');
    this.membershipTemplate = this.loadTemplate('membership.hbs');
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
    const url = `${this.configService.get<string>('SERVER_URL')}/invite?token=${token}`;
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

  async sendBatchUserEmail(subject: string, emails: [string], message: string) {
    const html = this.userTemplate({
      message,
    });

    emails.forEach(async (email) => {
      await this.transporter.sendMail({
        to: email,
        subject: subject,
        html: html,
      });
    });
  }

  async sendTickets(
    tickets: any,
    user: UserDto,
    business: BusinessDto,
    event: any,
  ) {
    const html = this.ticketsTemplate({
      name: `${user.firstName} ${user.lastName}`,
      tickets,
      business,
      event: { name: event.name, date: formatEventDate(event.date) },
    });

    await this.transporter.sendMail({
      to: user.email,
      subject: `Your ${business.name} ticket/s for ${event.name}`,
      html: html,
    });
  }

  async sendMembership(
    user: UserDto,
    business: BusinessDto,
    membership: MembershipDto,
    membershipType: MembershipTypeDto,
  ) {
    const html = this.membershipTemplate({
      name: `${user.firstName} ${user.lastName}`,
      expiryDate: formatExpiryDate(membership.expiryDate),
      membershipType: membershipType,
      business,
    });
    await this.transporter.sendMail({
      to: user.email,
      subject: `Your ${business.name} membership`,
      html: html,
    });
  }
}

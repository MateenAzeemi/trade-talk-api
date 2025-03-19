import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abdulmuqeet.qfn@gmail.com',
      pass: 'zdyporrozoepmvux',
    },
  });

  async sendVerificationEmail(email: string, code: string) {
    await this.transporter.sendMail({
      from: '"TradeTalk" <abdulmuqeet.qfn@gmail.com>',
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    });
  }
}

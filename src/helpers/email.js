import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class Email {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS
      }
    });
  };

  send = async(user, subject, web) => {
    console.log(user);
    const result = await this.transport.sendMail({
      from: config.MAIL_USER,
      to: user,
      subject,
      web
    });

    return result;
  };
}
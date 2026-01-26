//import type { Transporter } from 'nodemailer';
import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import 'dotenv/config';

const TOKEN = process.env.MAILTRAP_API_TOKEN!;

const transporter = Nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'a0be89001@smtp-brevo.com',
    pass: process.env.BREVO_PASSWORD,
  }
});

export default transporter;
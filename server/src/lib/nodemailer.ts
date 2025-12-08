//import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const host = process.env.MAILTRAP_DEV_HOST;
const port = 587;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_DEV_USER,
    pass: process.env.MAILTRAP_DEV_PASS,
  },
});

export default transporter;
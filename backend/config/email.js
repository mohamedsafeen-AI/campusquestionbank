/**
 * Nodemailer Gmail SMTP configuration.
 */

const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_HOST) throw new Error('Missing SMTP_HOST');
if (!SMTP_USER) throw new Error('Missing SMTP_USER');
if (!SMTP_PASS) throw new Error('Missing SMTP_PASS');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

module.exports = { transporter };


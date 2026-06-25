import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export async function createDraft(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Envoi vers sa propre boîte en tant que brouillon
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // On s'envoie à soi-même
    subject: `[BROUILLON] Re: ${subject} → À envoyer à : ${to}`,
    text: `DESTINATAIRE FINAL : ${to}\n\n${body}`,
  });

  console.log(`📝 Brouillon créé pour : ${to}`);
}
import * as dotenv from 'dotenv';
import * as Imap from 'imap-simple';

dotenv.config();

export interface Email {
  from: string;
  subject: string;
  body: string;
  uid: number;
}

export async function readUnreadEmails(): Promise<Email[]> {
  const config = {
    imap: {
      user: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASSWORD || '',
      host: process.env.EMAIL_HOST || 'imap.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 993,
      tls: true,
      authTimeout: 3000,
      tlsOptions: { rejectUnauthorized: false }
    }
  };

  const connection = await Imap.connect(config);
  await connection.openBox('INBOX');

  const searchCriteria = ['UNSEEN'];
  const fetchOptions = {
    bodies: ['HEADER.FIELDS (FROM SUBJECT)', 'TEXT'],
    markSeen: false
  };

  const messages = await connection.search(searchCriteria, fetchOptions);
  
  const emails: Email[] = messages.map((msg) => {
    const header = msg.parts.find(p => p.which === 'HEADER.FIELDS (FROM SUBJECT)');
    const body = msg.parts.find(p => p.which === 'TEXT');

    return {
      from: header?.body?.from?.[0] || 'Inconnu',
      subject: header?.body?.subject?.[0] || 'Sans objet',
      body: body?.body || '',
      uid: msg.attributes.uid
    };
  });

  connection.end();
  return emails;
}
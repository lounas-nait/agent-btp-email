import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function main() {
  const code = '4/0AdkVLPydSxB-5_hvcHmnlq7tNjjzYd8sViRGjY0VHaNdasSaE7d_nSJNThfeOdbUL6GbRQ';
  const { tokens } = await oauth2Client.getToken(code);
  console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
}

main();
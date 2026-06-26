import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as url from 'url';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('🔗 Ouvre ce lien dans ton navigateur :');
console.log(authUrl);

// Serveur local pour récupérer le code
const server = http.createServer(async (req, res) => {
  const queryParams = url.parse(req.url || '', true).query;
  const code = queryParams.code as string;

  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Token récupéré !');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
    
    res.end('Token récupéré ! Tu peux fermer cette fenêtre.');
    server.close();
  }
});

server.listen(3000, () => {
  console.log('\n⏳ En attente du callback...');
});
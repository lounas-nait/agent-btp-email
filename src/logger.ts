import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  date: string;
  from: string;
  subject: string;
  type: string;
  urgence: string;
  action: string;
}

export function logEmail(entry: LogEntry): void {
  const logPath = path.join(__dirname, '../logs/emails.log');
  
  // Créer le dossier logs s'il n'existe pas
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const line = `${entry.date} | ${entry.from} | ${entry.subject} | ${entry.type} | ${entry.urgence} | ${entry.action}\n`;
  
  fs.appendFileSync(logPath, line, 'utf8');
  console.log(`✅ Log ajouté : ${entry.type} - ${entry.subject}`);
}
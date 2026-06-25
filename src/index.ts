import * as dotenv from 'dotenv';
import { readUnreadEmails } from './emailReader';
import { analyzeEmail } from './analyzer';
import { createDraft } from './draftWriter';
import { logEmail } from './logger';

dotenv.config();

async function main() {
  console.log('🤖 Agent BTP démarré...');
  
  try {
    // 1. Lire les emails non lus
    console.log('📬 Lecture des emails...');
    const emails = await readUnreadEmails();
    
    if (emails.length === 0) {
      console.log('✅ Aucun email à traiter.');
      return;
    }

    console.log(`📨 ${emails.length} email(s) trouvé(s).`);

    // 2. Traiter chaque email
    for (const email of emails) {
      console.log(`\n🔍 Analyse de : ${email.subject}`);
      
      // 3. Analyser avec l'IA
      const analysis = await analyzeEmail(
        email.from,
        email.subject,
        email.body
      );

      console.log(`📊 Type: ${analysis.type} | Urgence: ${analysis.urgence}`);

      // 4. Créer le brouillon
      await createDraft(
        email.from,
        `Re: ${email.subject}`,
        analysis.reponse
      );

      // 5. Logger
      logEmail({
        date: new Date().toLocaleString('fr-FR'),
        from: email.from,
        subject: email.subject,
        type: analysis.type,
        urgence: analysis.urgence,
        action: 'Brouillon créé'
      });
    }

    console.log('\n✅ Tous les emails ont été traités.');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

main();
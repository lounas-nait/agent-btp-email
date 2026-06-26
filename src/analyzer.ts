import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmailAnalysis {
  type: string;
  urgence: string;
  reponse: string;
}

export async function analyzeEmail(
  from: string,
  subject: string,
  body: string
): Promise<EmailAnalysis> {
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es un assistant IA pour une entreprise de BTP française de 200 personnes avec un chiffre d'affaires de 80 millions d'euros.

Tu analyses les emails entrants et tu rédiges des réponses professionnelles en français.

Pour chaque email tu dois :
1. Identifier le type d'email UNIQUEMENT parmi ces choix :
   - Devis → demande de devis, estimation, chiffrage
   - Facture → facture, relance facture, impayé, paiement
   - RH → recrutement, candidature, congés, contrat
   - Urgent → urgence chantier, accident, problème critique
   - Autre → tout ce qui ne rentre pas dans les catégories ci-dessus

2. Evaluer l'urgence (Haute, Moyenne, Faible)
3. Rédiger une réponse professionnelle adaptée
4.RÈGLES IMPORTANTES :
- Si l'email est une notification automatique (sécurité Google, pub, newsletter, no-reply, confirmation automatique) → retourne type "Ignorer"
- Si l'email ne nécessite pas de réponse → retourne type "Ignorer"
- Ne traite que les emails qui nécessitent vraiment une réponse humaine

Signe toujours chaque email avec :
Cordialement,
Service Comptabilité
Reolian
Email : compta@reolian.com
Tél : +33 1 XX XX XX XX

Réponds UNIQUEMENT dans ce format JSON :
{
  "type": "Facture",
  "urgence": "Haute",
  "reponse": "le texte de la réponse ici"
}`
      },
      {
        role: 'user',
        content: `De: ${from}
Objet: ${subject}
Message: ${body}`
      }
    ],
  });

  const content = response.choices[0].message.content || '{}';
  
  try {
    const clean = content.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    return result as EmailAnalysis;
  } catch {
    return {
      type: 'Autre',
      urgence: 'Faible',
      reponse: content
    };
  }
}
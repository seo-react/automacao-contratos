const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credenciais.json',
  scopes: ['https://www.googleapis.com/auth/documents.readonly']
});

async function testarLeitura() {
  const client = await auth.getClient();
  const docs = google.docs({ version: 'v1', auth: client });

  const modeloId = '1ExfSXaY2sxID2qf3whq1UNzx7kX3H1HbpIXEPcpkDjc';

  try {
    const res = await docs.documents.get({ documentId: modeloId });
    console.log('✅ Acesso confirmado. Título do documento:', res.data.title);
  } catch (err) {
    console.error('❌ Erro ao acessar o documento:', err.message);
  }
}

testarLeitura();

const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { enviarEmailDeAprovacao } = require('./email');
const { enviarParaD4Sign } = require('./integracoes/d4sign'); // 👈 novo

const auth = new google.auth.GoogleAuth({
  keyFile: 'credenciais.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

async function exportarContratoComoPDF(documentId, nomeArquivo, dadosSignatario) {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  const url = `https://www.googleapis.com/drive/v3/files/${documentId}/export?mimeType=application/pdf`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`
      },
      responseType: 'stream'
    });

    const caminho = path.join(__dirname, `${nomeArquivo}.pdf`);
    const writer = fs.createWriteStream(caminho);

    response.data.pipe(writer);

    writer.on('finish', async () => {
      console.log(`✅ PDF exportado com sucesso: ${caminho}`);

      // 1. Envia o e-mail de aprovação
      await enviarEmailDeAprovacao({
        nome: dadosSignatario.nome,
        email: dadosSignatario.email,
        id: nomeArquivo.replace('.pdf', '')
      });

      // 2. Envia para assinatura via D4Sign
      await enviarParaD4Sign(nomeArquivo, dadosSignatario.email, dadosSignatario.nome);
    });

    writer.on('error', (err) => {
      console.error('❌ Erro ao salvar o PDF:', err.message);
    });
  } catch (err) {
    console.error('❌ Erro ao exportar o contrato:', err.response?.data?.error?.message || err.message);
  }
}

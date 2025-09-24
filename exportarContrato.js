const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { enviarEmailDeAprovacao } = require('./email'); // 👈 novo

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

      // 👇 envia o e-mail após exportar
      await enviarEmailDeAprovacao({
        nome: dadosSignatario.nome,
        email: dadosSignatario.email,
        id: nomeArquivo.replace('.pdf', '')
      });
    });

    writer.on('error', (err) => {
      console.error('❌ Erro ao salvar o PDF:', err.message);
    });
  } catch (err) {
    console.error('❌ Erro ao exportar o contrato:', err.response?.data?.error?.message || err.message);
  }
}

// Exemplo de uso
const documentId = '1kGxkIxCZlQkTpTvrl3dBlrZGFTsdITbnmnXzeZtYfCM';
const nomeArquivo = 'Contrato_Abdiel_Marins.pdf';
const dadosSignatario = {
  nome: 'Abdiel Marins',
  email: 'abdiel@tribo.com'
};

exportarContratoComoPDF(documentId, nomeArquivo, dadosSignatario);

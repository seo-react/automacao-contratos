const axios = require('axios');
const { gerarContratoPDF, lerPDFComoBase64 } = require('../utils/gerarContrato');

async function aprovarContrato({ nomeArquivo, signatario, dados }) {
  const caminhoPDF = gerarContratoPDF(dados, nomeArquivo);
  const base64 = lerPDFComoBase64(caminhoPDF);

  const SIMULACAO = process.env.SIMULACAO === 'true';

  if (SIMULACAO) {
    console.log('🧪 Modo simulação ativado.');
    console.log('📄 Documento gerado:', nomeArquivo);
    console.log('👤 Signatário simulado:', signatario.email);
    console.log('✅ Simulação concluída com sucesso.');
    return;
  }

  const uuid_cofre = process.env.D4SIGN_COFRE;
  const uuid_pasta = process.env.D4SIGN_PASTA;
  const tokenAPI = process.env.D4SIGN_API_TOKEN;
  const cryptKey = process.env.D4SIGN_CRYPT_KEY;

  // 1. Upload do documento
  const uploadRes = await axios.post('https://secure.d4sign.com.br/api/v1/documents/upload', {
    base64,
    name: nomeArquivo,
    uuid_cofre,
    uuid_pasta
  }, {
    headers: { tokenAPI, cryptKey }
  });

  const uuid_document = uploadRes.data.uuid;
  console.log('📤 Documento enviado. UUID:', uuid_document);

  // 2. Adicionar signatário
  await axios.post('https://secure.d4sign.com.br/api/v1/documents/addSigner', {
    uuid_document,
    email: signatario.email,
    action: 'SIGN',
    foreign: false,
    certificadoicpbr: false
  }, {
    headers: { tokenAPI, cryptKey }
  });

  console.log('✍️ Signatário adicionado:', signatario.email);

  // 3. Enviar convite
  await axios.post('https://secure.d4sign.com.br/api/v1/documents/sendDocument', {
    uuid_document
  }, {
    headers: { tokenAPI, cryptKey }
  });

  console.log('📨 Convite de assinatura enviado!');
}

module.exports = { aprovarContrato };

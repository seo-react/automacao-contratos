const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const API_KEY = process.env.D4SIGN_API_KEY;
const CRYPT_KEY = process.env.D4SIGN_CRYPT_KEY;
const FOLDER_ID = process.env.D4SIGN_FOLDER_ID;

async function enviarParaD4Sign(nomeArquivo, emailSignatario, nomeSignatario) {
  const caminhoPDF = path.join(__dirname, '../pdfs', nomeArquivo);
  const pdfBuffer = fs.readFileSync(caminhoPDF);

  try {
    // 1. Criar documento no cofre
    const formData = new FormData();
    formData.append('file', pdfBuffer, nomeArquivo);
    formData.append('name', nomeArquivo);
    formData.append('folder_uuid', FOLDER_ID);

    const docRes = await axios.post('https://api.d4sign.com.br/api/v1/documents', formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ...formData.getHeaders()
      }
    });

    const uuidDoc = docRes.data.uuid;
    console.log(`📄 Documento criado na D4Sign: ${uuidDoc}`);

    // 2. Adicionar signatário
    await axios.post(`https://api.d4sign.com.br/api/v1/documents/${uuidDoc}/participants`, {
      email: emailSignatario,
      name: nomeSignatario,
      act: 'sign',
      foreign: false
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    console.log(`👤 Signatário adicionado: ${emailSignatario}`);

    // 3. Enviar para assinatura
    await axios.post(`https://api.d4sign.com.br/api/v1/documents/${uuidDoc}/send`, {}, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    console.log(`🚀 Documento enviado para assinatura!`);
    return uuidDoc;
  } catch (err) {
    console.error('❌ Erro na integração com D4Sign:', err.response?.data || err.message);
  }
}

module.exports = { enviarParaD4Sign };

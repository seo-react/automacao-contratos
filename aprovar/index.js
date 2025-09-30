const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function aprovarContrato({ nomeArquivo, signatario, dados }) {
  try {
    const caminhoPDF = path.join(__dirname, '..', nomeArquivo);

    // 🔐 Autenticação
    const tokenAPI = process.env.D4SIGN_API_KEY;
    const cryptKey = process.env.D4SIGN_CRYPT_KEY;

    if (!fs.existsSync(caminhoPDF)) {
      throw new Error(`Arquivo PDF não encontrado: ${caminhoPDF}`);
    }

    // 📤 Upload do documento
    const uploadResponse = await axios.post(
      'https://secure.d4sign.com.br/api/v1/documents',
      {
        name: nomeArquivo,
        folder: process.env.D4SIGN_FOLDER_ID
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          tokenAPI,
          cryptKey
        }
      }
    );

    const documentKey = uploadResponse.data.uuid;

    // 👤 Cadastrar signatário
    await axios.post(
      `https://secure.d4sign.com.br/api/v1/documents/${documentKey}/signers`,
      {
        email: signatario.email,
        name: signatario.nome,
        cpf: signatario.cpf
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          tokenAPI,
          cryptKey
        }
      }
    );

    // 🚀 Enviar para assinatura
    await axios.post(
      `https://secure.d4sign.com.br/api/v1/documents/${documentKey}/send`,
      {},
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          tokenAPI,
          cryptKey
        }
      }
    );

    console.log(`✅ Contrato ${nomeArquivo} enviado para assinatura`);
  } catch (err) {
    console.error('❌ Erro ao aprovar contrato:', err.stack);
    throw err;
  }
}

module.exports = { aprovarContrato };

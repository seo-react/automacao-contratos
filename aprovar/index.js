const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

async function aprovarContrato({ nomeArquivo, signatario, dados }) {
  try {
    const caminhoPDF = path.join(__dirname, '..', 'pdfs', nomeArquivo);

    // 🔐 Autenticação
    const tokenAPI = process.env.D4SIGN_API_KEY;
    const cryptKey = process.env.D4SIGN_CRYPT_KEY;
    const folderID = process.env.D4SIGN_FOLDER_ID;

    if (!fs.existsSync(caminhoPDF)) {
      throw new Error(`Arquivo PDF não encontrado: ${caminhoPDF}`);
    }

    // 📤 Upload do documento com o PDF anexado
    const pdfBuffer = fs.readFileSync(caminhoPDF);
    const formData = new FormData();
    formData.append('file', pdfBuffer, nomeArquivo);
    formData.append('name', nomeArquivo);
    formData.append('folder', folderID);

    const uploadResponse = await axios.post(
  'https://secure.d4sign.com.br/api/v1/documents',
  formData,
  {
    headers: {
      ...formData.getHeaders(),
      Accept: 'application/json'
    },
    params: {
      tokenAPI,
      cryptKey
    }
  }
);

const documentKey = uploadResponse.data.documents?.[0]?.uuid;

if (!documentKey) {
  console.log('📤 Resposta completa da D4Sign:', uploadResponse.data);
  throw new Error('❌ UUID do documento não encontrado na resposta da D4Sign');
}

console.log(`📄 Documento criado na D4Sign: ${documentKey}`);

    

    // 👤 Cadastrar signatário
    await axios.post(
      `https://secure.d4sign.com.br/api/v1/documents/${documentKey}/signers`,
      {
        email: signatario.email,
        name: signatario.nome,
        cpf: signatario.cpf || ''
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          tokenAPI,
          cryptKey
        }
      }
    );

    console.log(`👤 Signatário adicionado: ${signatario.email}`);

    // 🚀 Enviar para assinatura
    await axios.post(
      `https://secure.d4sign.com.br/api/v1/documents/${documentKey}/send`,
      {},
      {
        headers: {
          Accept: 'application/json',
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
    console.error('❌ Erro ao aprovar contrato:', err.response?.data || err.stack);
    throw err;
  }
}

module.exports = { aprovarContrato };

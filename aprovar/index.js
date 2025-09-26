require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Credenciais da D4Sign
const tokenAPI = process.env.D4SIGN_API_TOKEN;
const cryptKey = process.env.D4SIGN_CRYPT_KEY;


// Função principal que envia o contrato para assinatura
async function aprovarContrato({ nomeArquivo, signatario }) {
  const caminhoPDF = path.join(__dirname, '..', nomeArquivo);
  console.log('📄 Verificando arquivo:', caminhoPDF);

  if (!fs.existsSync(caminhoPDF)) {
    console.error('❌ PDF não encontrado:', caminhoPDF);
    throw new Error('PDF não encontrado.');
  }

  // Se estiver em modo simulado, pula chamadas reais
  if (process.env.SIMULACAO === 'true') {
    console.log('⚙️ Modo simulado ativado. Pulando chamadas reais...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Documento simulado. UUID: fake-uuid-1234567890');
    console.log('👤 Signatário simulado:', signatario.nome);
    console.log('📨 Convite simulado enviado!');
    return;
  }

  try {
    // 1. Upload do documento
    const form = new FormData();
    form.append('file', fs.createReadStream(caminhoPDF));
    form.append('name', nomeArquivo);
    form.append('folder', 'default');

    console.log('📤 Enviando documento para D4Sign...');
    const uploadResponse = await axios.post('https://secure.d4sign.com.br/api/v1/documents/upload', form, {
      headers: {
        tokenAPI,
        cryptKey,
        ...form.getHeaders()
      }
    });

    const uuid = uploadResponse.data.uuid;
    console.log('✅ Documento enviado. UUID:', uuid);

    // 2. Adiciona o signatário
    console.log('👤 Adicionando signatário...');
    await axios.post('https://secure.d4sign.com.br/api/v1/documents/addSigner', null, {
      headers: {
        tokenAPI,
        cryptKey
      },
      params: {
        uuid,
        signer: signatario.email,
        act: 'sign',
        name: signatario.nome,
        phone_country: '55',
        phone_number: signatario.telefone.replace(/\D/g, '')
      }
    });

    console.log('✅ Signatário adicionado:', signatario.nome);

    // 3. Dispara o convite para assinatura
    console.log('📨 Enviando convite de assinatura...');
    await axios.post('https://secure.d4sign.com.br/api/v1/documents/sendToSigner', null, {
      headers: {
        tokenAPI,
        cryptKey
      },
      params: { uuid }
    });

    console.log('✅ Convite enviado com sucesso!');
  } catch (err) {
    const erroDetalhado = err.response?.data || err.message;
    console.error('❌ Erro durante o processo:', erroDetalhado);
    throw new Error(`Erro ao aprovar contrato: ${JSON.stringify(erroDetalhado)}`);
  }
}

module.exports = { aprovarContrato };

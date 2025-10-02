const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { aprovarContrato } = require('./aprovar/index');
const { gerarContratoPDF } = require('./utils/gerarContrato');
const { enviarEmail } = require('./enviarEmail');

const app = express();
const PORT = process.env.PORT || 3000;

// 🗂️ Lista de contratos pendentes
const contratosPendentes = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// 🌐 Rotas de páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/solicitar', (req, res) => {
  res.sendFile(path.join(__dirname, 'solicitar.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 🔄 API para carregar contratos no dashboard
app.get('/api/contratos', (req, res) => {
  res.json(contratosPendentes);
});

// 📥 Recebe formulário e gera contrato
app.post('/aprovar', async (req, res) => {
  const dados = req.body;
  const nomeArquivo = `Contrato_${removerAcentos(dados.representanteNome || 'Desconhecido').replace(/\s+/g, '_')}.pdf`;

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


  try {
    console.log('📥 Dados recebidos do formulário:', dados);

    const caminhoPDF = gerarContratoPDF(dados, nomeArquivo);
    console.log('📄 PDF gerado em:', caminhoPDF);

    // ✉️ Envia e-mail
    await enviarEmail({
      nome: dados.nome,
      contratoId: nomeArquivo.replace('.pdf', ''),
      caminhoPDF,
      representanteNome: dados.representanteNome,
      representanteEmail: dados.representanteEmail,
      representanteCPF: dados.representanteCPF,
      empresa: dados.empresa,
      website: dados.website,
      razaoSocial: dados.razaoSocial,
      cnpj: dados.cnpj,
      telefone: dados.telefone,
      emailFaturamento: dados.emailFaturamento,
      diaPagamento: dados.diaPagamento,
      outrosSignatarios: dados.outrosSignatarios,
      servico: 'Gestão de Redes Sociais',
      valor: 'R$ 3.500,00'
    });

    // 🗂️ Adiciona contrato à lista
    contratosPendentes.unshift({
      nome: dados.representanteNome,
      servico: 'Gestão de Redes Sociais',
      empresa: dados.empresa,
      id: nomeArquivo.replace('.pdf', '')
    });

    res.send(`
      <html>
        <head><title>Contrato Recebido</title></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h2 style="color:green;">✅ Solicitação recebida com sucesso!</h2>
          <p>O contrato de <strong>${dados.representanteNome}</strong> foi gerado e enviado para sua aprovação por e-mail.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('❌ Erro ao aprovar contrato via formulário:', err);
    res.status(500).send(`
      <html>
        <head><title>Erro na solicitação</title></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h2 style="color:red;">❌ Erro ao processar solicitação</h2>
          <pre>${err.message}</pre>
        </body>
      </html>
    `);
  }
});

// ✅ Confirmação de aprovação
app.get('/confirmar', async (req, res) => {
  const contratoId = req.query.id;
  const nomeArquivo = `${contratoId}.pdf`;

  try {
    console.log('✅ Confirmação recebida para:', nomeArquivo);

    await aprovarContrato({
      nomeArquivo,
      signatario: {
        email: 'abdiel@agenciatribo.com.br',
        nome: 'Abdiel Marins',
        telefone: '83999999999'
      },
      dados: {}
    });

    res.send(`
      <html>
        <head><title>Contrato Aprovado</title></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h2 style="color:green;">✅ Contrato aprovado com sucesso!</h2>
          <p>O contrato foi enviado para assinatura via D4Sign.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('❌ Erro na confirmação:', err);
    res.status(500).send(`
      <html>
        <head><title>Erro na aprovação</title></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h2 style="color:red;">❌ Erro ao aprovar contrato</h2>
          <pre>${err.message}</pre>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

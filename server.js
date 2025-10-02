const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { aprovarContrato } = require('./aprovar/index');
const { gerarContratoPDF } = require('./utils/gerarContrato');
const { enviarEmail } = require('./enviarEmail'); // ← novo import

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/solicitar', (req, res) => {
  res.sendFile(path.join(__dirname, 'solicitar.html'));
});

app.post('/aprovar', async (req, res) => {
  const dados = req.body;
  const nomeArquivo = `Contrato_${dados.representanteNome?.replace(/\s+/g, '_') || 'Desconhecido'}.pdf`;

  try {
    console.log('📥 Dados recebidos do formulário:', dados);

    const caminhoPDF = gerarContratoPDF(dados, nomeArquivo);
    console.log('📄 PDF gerado em:', caminhoPDF);

    // ✉️ Envia e-mail de aprovação com botões
   await enviarEmail({
  nome: dados.representanteNome,
  contratoId: nomeArquivo.replace('.pdf', ''),
  caminhoPDF,
  emailDestino: dados.representanteEmail,
  empresa: dados.empresa,
  servico: 'Gestão de Redes Sociais',
  valor: 'R$ 3.500,00'
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

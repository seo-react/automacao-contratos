const express = require('express');
const path = require('path');
const { aprovarContrato } = require('./aprovar/index');

const app = express();
const PORT = 3000;

// 🔧 Serve arquivos estáticos da raiz (onde está o index.html)
app.use(express.static(__dirname));

// 🔧 Rota principal carrega o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔧 Rota de aprovação via interface
app.get('/aprovar', async (req, res) => {
  const contratoId = req.query.id;
  const nomeArquivo = `Contrato_${contratoId}.pdf`;

  try {
    console.log('🔧 Chamando aprovarContrato com:', nomeArquivo);
    await aprovarContrato({
      nomeArquivo,
      signatario: {
        email: 'abdiel@tribo.com',
        nome: 'Abdiel Marins',
        telefone: '83999999999'
      }
    });

    res.send('✅ Contrato aprovado e enviado para assinatura!');
  } catch (err) {
    console.error('❌ Erro completo:', err);
    res.status(500).send(`❌ Erro ao aprovar contrato: ${err.message}`);
  }
});

// 🔧 Rota de aprovação via botão do e-mail
app.get('/confirmar', async (req, res) => {
  const contratoId = req.query.id;
  const nomeArquivo = `${contratoId}.pdf`;

  try {
    console.log('✅ Confirmação recebida para:', nomeArquivo);
    await aprovarContrato({
      nomeArquivo,
      signatario: {
        email: 'abdiel@tribo.com',
        nome: 'Abdiel Marins',
        telefone: '83999999999'
      }
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

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Endpoint para receber os dados do formulário
app.post('/webhook-contrato', (req, res) => {
  const dados = req.body;

  console.log('📥 Dados recebidos do formulário:');
  console.log(dados);

  // Aqui você pode salvar em banco, enviar para o n8n, gerar contrato, etc.
  res.status(200).send({ status: 'ok', mensagem: 'Dados recebidos com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando em http://localhost:${PORT}/webhook-contrato`);
});

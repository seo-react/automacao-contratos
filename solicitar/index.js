const express = require('express');
const router = express.Router();
const { aprovarContrato } = require('../../aprovar');

router.post('/', async (req, res) => {
  try {
    const dados = req.body;

    const nomeArquivo = `Contrato-${Date.now()}.pdf`;
    const signatario = {
      email: dados.representanteEmail
    };

    await aprovarContrato({ nomeArquivo, signatario, dados });

    res.status(200).json({ mensagem: 'Contrato gerado e enviado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao solicitar contrato:', error);
    res.status(500).json({ erro: 'Falha ao processar solicitação.' });
  }
});

module.exports = router;

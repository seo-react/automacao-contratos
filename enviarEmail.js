const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail({ nome, contratoId, caminhoPDF }) {
  console.log(`📤 Enviando e-mail via Resend para: ${nome}`);

  const htmlEmail = `
    <h2>Contrato gerado para revisão</h2>
    <p>Olá Abdiel, o contrato está pronto para sua aprovação.</p>
    <p><strong>Serviço:</strong> Gestão de Redes Sociais</p>
    <p><strong>Valor:</strong> R$ 3.500,00</p>
    <br>
    <a href="https://contratos-tribo.onrender.com/confirmar?id=${contratoId}" style="padding: 10px 20px; background-color: #34a853; color: white; text-decoration: none; border-radius: 5px;">✅ Aprovar</a>
    <br><br>
    <p>O PDF também está anexado para referência.</p>
  `;

  try {
    const pdfBuffer = fs.readFileSync(caminhoPDF);

    await resend.emails.send({
      from: 'Agência Tribo <contato@agenciatribo.com.br>',
      to: ['contatomarins7@gmail.com'],
      subject: `Contrato para aprovação: ${nome}`,
      html: htmlEmail,
      attachments: [
        {
          filename: `${contratoId}.pdf`,
          content: pdfBuffer.toString('base64'),
        }
      ]
    });

    console.log('✅ E-mail enviado com sucesso via Resend!');
  } catch (err) {
    console.error('❌ Erro ao enviar com Resend:', err);
  }
}

module.exports = { enviarEmail };

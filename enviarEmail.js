const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

async function enviarEmail({ nome, contratoId, caminhoPDF }) {
  console.log(`📤 Disparando envio de e-mail para aprovação do contrato: ${contratoId}`);

  const documentId = '1kGxkIxCZlQkTpTvrl3dBlrZGFTsdITbnmnXzeZtYfCM';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_REMETENTE,
      pass: process.env.EMAIL_SENHA
    }
  });

  const htmlEmail = `
    <h2>Contrato gerado para revisão</h2>
    <p>Olá Abdiel, o contrato está pronto para sua aprovação.</p>
    <p><strong>Serviço:</strong> Gestão de Redes Sociais</p>
    <p><strong>Valor:</strong> R$ 3.500,00</p>
    <br>
    <a href="https://docs.google.com/document/d/${documentId}/edit" style="padding: 10px 20px; background-color: #fbbc04; color: black; text-decoration: none; border-radius: 5px;">📄 Abrir contrato</a>
    &nbsp;&nbsp;
    <a href="https://contratos-tribo.onrender.com/confirmar?id=${contratoId}" style="padding: 10px 20px; background-color: #34a853; color: white; text-decoration: none; border-radius: 5px;">✅ Aprovar</a>
    <br><br>
    <p>O PDF também está anexado para referência.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Agência Tribo" <${process.env.EMAIL_REMETENTE}>`,
      to: process.env.EMAIL_REMETENTE,
      subject: `Contrato para aprovação: ${nome}`,
      html: htmlEmail,
      attachments: [
        {
          filename: `${contratoId}.pdf`,
          path: caminhoPDF
        }
      ]
    });

    console.log('✅ E-mail enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao enviar o e-mail:', err);
  }
}

module.exports = { enviarEmail };

const nodemailer = require('nodemailer');

async function enviarEmailDeAprovacao({ nome, email, id }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abdiel@agenciatribo.com.br',
      pass: 'jqmp cbbg uvhp datj'
    }
  });

  const html = `
    <p>Olá ${nome},</p>
    <p>Seu contrato está pronto para revisão:</p>
    <p>
      <strong>Empresa:</strong> Agência Tribo<br>
      <strong>Serviço:</strong> Social Media<br>
      <strong>Contrato:</strong> <a href="https://docs.google.com/document/d/1VGup3Bqd9p-rrj-0CIgN50mMcVXA3uwap9jGXT0OcsI/edit?usp=sharing" target="_blank">Abrir no Google Docs</a>
    </p>
    <p>
      <a href="http://localhost:3000/confirmar?id=${id}" style="background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">✅ APROVAR</a>
    </p>
    <p>Após aprovação, o contrato será enviado para assinatura via D4Sign.</p>
  `;

  await transporter.sendMail({
    from: 'Contratos <abdiel@agenciatribo.com.br>',
    to: email,
    subject: 'Seu contrato está pronto para aprovação',
    html
  });

  console.log('📧 E-mail enviado para:', email);
}

module.exports = { enviarEmailDeAprovacao };

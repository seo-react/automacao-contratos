const nodemailer = require('nodemailer');
const path = require('path');

// Caminho do PDF exportado
const caminhoPDF = path.join(__dirname, 'Contrato_Abdiel_Marins.pdf');

// ID do contrato no Google Docs
const documentId = '1kGxkIxCZlQkTpTvrl3dBlrZGFTsdITbnmnXzeZtYfCM';

// Configuração do transporte SMTP (exemplo com Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SENHA_DO_APP' // Use senha de app, não sua senha pessoal
  }
});

// HTML do e-mail com botões
const htmlEmail = `
  <h2>Contrato gerado para revisão</h2>
  <p>Olá Abdiel, o contrato está pronto para sua aprovação.</p>
  <p><strong>Serviço:</strong> Gestão de Redes Sociais</p>
  <p><strong>Valor:</strong> R$ 3.500,00</p>
  <br>
  <a href="https://docs.google.com/document/d/${documentId}/edit" style="padding: 10px 20px; background-color: #fbbc04; color: black; text-decoration: none; border-radius: 5px;">📄 Abrir contrato</a>
  &nbsp;&nbsp;
  <a href="https://seudominio.com/aprovar?id=${documentId}" style="padding: 10px 20px; background-color: #34a853; color: white; text-decoration: none; border-radius: 5px;">✅ Aprovar</a>
  <br><br>
  <p>O PDF também está anexado para referência.</p>
`;

async function enviarEmail() {
  try {
    await transporter.sendMail({
      from: '"Agência Tribo" <SEU_EMAIL@gmail.com>',
      to: 'abdiel@agenciatribo.com.br',
      subject: 'Contrato para aprovação',
      html: htmlEmail,
      attachments: [
        {
          filename: 'Contrato_Abdiel_Marins.pdf',
          path: caminhoPDF
        }
      ]
    });

    console.log('✅ E-mail enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao enviar o e-mail:', err.message);
  }
}

enviarEmail();

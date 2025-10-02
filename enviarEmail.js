const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail({
  contratoId,
  caminhoPDF,
  representanteNome,
  representanteEmail,
  representanteCPF,
  empresa,
  website,
  razaoSocial,
  cnpj,
  telefone,
  emailFaturamento,
  diaPagamento,
  outrosSignatarios,
  servico,
  valor
}) {

  console.log(`📤 Enviando e-mail via Resend para: ${nome}`);

  const htmlEmail = `
  <h2>Contrato gerado para revisão</h2>
  <p>Olá ${representanteNome}, o contrato está pronto para sua aprovação.</p>

  <h3>📌 Detalhes da Solicitação</h3>
  <ul>
    <li><strong>Empresa:</strong> ${empresa}</li>
    <li><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></li>
    <li><strong>Razão Social:</strong> ${razaoSocial}</li>
    <li><strong>CNPJ:</strong> ${cnpj}</li>
    <li><strong>Telefone:</strong> ${telefone}</li>
    <li><strong>E-mail de Faturamento:</strong> ${emailFaturamento}</li>
    <li><strong>Dia de Pagamento:</strong> Dia ${diaPagamento}</li>
  </ul>

  <h3>👤 Representante Legal</h3>
  <ul>
    <li><strong>Nome:</strong> ${representanteNome}</li>
    <li><strong>Email:</strong> ${representanteEmail}</li>
    <li><strong>CPF:</strong> ${representanteCPF}</li>
  </ul>

  ${outrosSignatarios ? `
    <h3>👥 Outros Signatários</h3>
    <p>${outrosSignatarios}</p>
  ` : ''}

  <h3>📄 Informações do Serviço</h3>
  <ul>
    <li><strong>Serviço:</strong> ${servico}</li>
    <li><strong>Valor:</strong> ${valor}</li>
  </ul>

  <p>Este contrato está em fase pré-contratual e contempla cláusulas de sigilo e confidencialidade.</p>

  <br>
  <a href="https://contratos-tribo.onrender.com/confirmar?id=${contratoId}" style="padding: 10px 20px; background-color: #34a853; color: white; text-decoration: none; border-radius: 5px;">✅ Aprovar Contrato</a>
  <br><br>
  <p>O PDF também está anexado para referência.</p>
`;


  try {
    const pdfBuffer = fs.readFileSync(caminhoPDF);

    await resend.emails.send({
      from: 'Agência Tribo <onboarding@resend.dev>',
      to: ['onboarding@resend.dev'],
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

const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail({
  nome,
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
  <p><strong>Empresa:</strong> ${empresa}</p>
  <p><strong>Website:</strong> ${website}</p>
  <p><strong>Razão Social:</strong> ${razaoSocial}</p>
  <p><strong>CNPJ:</strong> ${cnpj}</p>
  <p><strong>Telefone:</strong> ${telefone}</p>
  <p><strong>E-mail de Faturamento:</strong> ${emailFaturamento}</p>
  <p><strong>Dia de Pagamento:</strong> Dia ${diaPagamento}</p>
  <p><strong>Representante Legal:</strong> ${representanteNome} (${representanteCPF})</p>
  <p><strong>Email do Representante:</strong> ${representanteEmail}</p>
  ${outrosSignatarios ? `<p><strong>Outros Signatários:</strong> ${outrosSignatarios}</p>` : ''}
  <p><strong>Serviço:</strong> ${servico}</p>
  <p><strong>Valor:</strong> ${valor}</p>
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

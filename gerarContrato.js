// utils/gerarContrato.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function gerarContratoPDF(dados, nomeArquivo) {
  const doc = new PDFDocument();
  const pasta = path.join(__dirname, '../pdfs');
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

  const caminho = path.join(pasta, nomeArquivo);
  doc.pipe(fs.createWriteStream(caminho));

  doc.fontSize(18).text('Contrato de Prestação de Serviços', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Empresa: ${dados.empresa}`);
  doc.text(`Representante Legal: ${dados.representanteNome}`);
  doc.text(`CPF: ${dados.representanteCPF}`);
  doc.text(`Email: ${dados.representanteEmail}`);
  doc.text(`Dia de pagamento: ${dados.diaPagamento}`);
  doc.text(`CNPJ: ${dados.cnpj}`);
  doc.text(`Razão Social: ${dados.razaoSocial}`);
  doc.text(`Telefone: ${dados.telefone}`);
  doc.text(`Email de Faturamento: ${dados.emailFaturamento}`);
  doc.text(`Outros signatários: ${dados.outrosSignatarios || 'Nenhum'}`);

  doc.end();
  return caminho;
}

module.exports = { gerarContratoPDF };

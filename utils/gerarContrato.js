const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function gerarContratoPDF(dados, nomeArquivo) {
  const doc = new PDFDocument();
  const pasta = path.join(__dirname, '../pdfs');
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

  const caminho = path.join(pasta, nomeArquivo);
  doc.pipe(fs.createWriteStream(caminho));

  // Cabeçalho
  doc.fontSize(18).text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', { align: 'center' });
  doc.moveDown();

  // Corpo do contrato
  doc.fontSize(12).text(`Pelo presente instrumento, as partes abaixo qualificadas celebram o presente contrato:`).moveDown();

  doc.text(`Empresa: ${dados.empresa}`);
  doc.text(`Website: ${dados.website}`);
  doc.text(`Razão Social: ${dados.razaoSocial}`);
  doc.text(`CNPJ: ${dados.cnpj}`);
  doc.text(`Telefone: ${dados.telefone}`);
  doc.text(`E-mail de Faturamento: ${dados.emailFaturamento}`);
  doc.text(`Dia de pagamento acordado: ${dados.diaPagamento}`).moveDown();

  doc.text(`Representante Legal: ${dados.representanteNome}`);
  doc.text(`CPF do Representante: ${dados.representanteCPF}`);
  doc.text(`E-mail do Representante: ${dados.representanteEmail}`);
  doc.text(`Celular: ${dados.celular}`).moveDown();

  if (dados.outrosSignatarios) {
    doc.text(`Outros signatários:`);
    doc.text(dados.outrosSignatarios);
    doc.moveDown();
  }

  doc.text(`As partes declaram estar de acordo com os termos de sigilo e confidencialidade, conforme previsto na fase pré-contratual.`);

  doc.moveDown();
  doc.text(`Local e data: Cabedelo, ${new Date().toLocaleDateString('pt-BR')}`);
  doc.moveDown();

  // Assinatura
  doc.text(`__________________________________`);
  doc.text(`${dados.representanteNome}`);
  doc.text(`Representante Legal`);

  doc.end();
  return caminho;
}

function lerPDFComoBase64(caminho) {
  const arquivo = fs.readFileSync(caminho);
  return Buffer.from(arquivo).toString('base64');
}

module.exports = {
  gerarContratoPDF,
  lerPDFComoBase64
};

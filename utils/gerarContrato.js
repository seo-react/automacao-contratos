const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function gerarContratoPDF(dados, nomeArquivo) {
  const doc = new PDFDocument({ margin: 50 });
  const pasta = path.join(__dirname, '../pdfs');
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

  const caminho = path.join(pasta, nomeArquivo);
  doc.pipe(fs.createWriteStream(caminho));

  // Título
  doc.fontSize(16).text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GESTÃO DE MARKETING DIGITAL', { align: 'center' });
  doc.moveDown();

  // Qualificação das partes
  doc.fontSize(12).text(`Como contratante, ${dados.razaoSocial}, sociedade empresarial limitada, inscrita no CNPJ ${dados.cnpj}, com sede em [ENDEREÇO COMPLETO], neste ato representado por seu sócio, ${dados.representanteNome} (${dados.representanteEmail}).`);
  doc.moveDown();
  doc.text(`Como contratada, TRIBO DESIGN E COMUNICAÇÃO LTDA, inscrita no CNPJ 05.001.924/0001-26, com sede na Rua dos Pinheiros, n. 498, cj 42, Pinheiros, São Paulo/SP, CEP 05422-902, neste ato representada por seu sócio Maurício Fernandes Simão (mau@agenciatribo.com.br).`);
  doc.moveDown();
  doc.text(`Decidem as partes celebrar o presente contrato, que reger-se-á pelas cláusulas seguintes:`);
  doc.addPage();

  // Cláusulas principais
  doc.fontSize(14).text('Cláusula 1 – Do Objeto do contrato', { underline: true });
  doc.fontSize(12).text('A Contratada se compromete a prestar serviços de Marketing Digital, conforme descrito nos Anexos I e II.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 2 – Preço e Condições de Pagamento', { underline: true });
  doc.fontSize(12).text(`Valor: ${dados.valor}. Forma de pagamento: boleto bancário, com vencimento no dia ${dados.diaPagamento} de cada mês.`);
  doc.text('Multa de 10% por atraso, juros de 1% ao mês, e suspensão dos serviços após 30 dias de inadimplência.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 3 – Dos Serviços a serem Prestados', { underline: true });
  doc.fontSize(12).text('Prazos, entregas, comunicação, revisões e responsabilidades conforme descrito nos anexos.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 4 – Obrigações das Partes', { underline: true });
  doc.fontSize(12).text('Contratante: fornecer materiais, pagar pontualmente, participar das reuniões. Contratada: executar com diligência e manter comunicação.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 5 – Confidencialidade', { underline: true });
  doc.fontSize(12).text('Ambas as partes manterão sigilo absoluto por 3 anos após o término do contrato.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 6 – Propriedade Intelectual', { underline: true });
  doc.fontSize(12).text('Os direitos patrimoniais são cedidos ao contratante. Os direitos morais permanecem com a contratada.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 7 – Vigência e Rescisão', { underline: true });
  doc.fontSize(12).text('Vigência de 12 meses. Rescisão antecipada implica multa de 20%. Rescisão imotivada exige aviso prévio de 30 dias.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 8 – LGPD', { underline: true });
  doc.fontSize(12).text('O contratante consente com o tratamento de dados conforme os artigos da LGPD.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 9 – Disposições Gerais', { underline: true });
  doc.fontSize(12).text('Comunicações por e-mail ou WhatsApp. Uso de marca autorizado. Proibição de aliciamento por 3 anos.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 10 – Serviços Adicionais', { underline: true });
  doc.fontSize(12).text('Serviços adicionais podem ser contratados por e-mail, integrando-se automaticamente ao contrato.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 11 – Cláusula Penal', { underline: true });
  doc.fontSize(12).text('Descumprimento implica multa de 20% do valor total. Indenizações adicionais conforme art. 416 do Código Civil.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 12 – Assinatura Eletrônica', { underline: true });
  doc.fontSize(12).text('Assinatura via D4Sign com validade jurídica conforme legislação brasileira.');
  doc.moveDown();

  doc.fontSize(14).text('Cláusula 13 – Foro', { underline: true });
  doc.fontSize(12).text('Fica eleito o foro da Comarca de São Paulo – SP.');
  doc.moveDown();

  doc.text(`Local e data: São Paulo, ${new Date().toLocaleDateString('pt-BR')}`);
  doc.moveDown();

  doc.text(`__________________________________`);
  doc.text(`${dados.representanteNome}`);
  doc.text(`Representante Legal`);

  doc.end();
  return caminho;
}

module.exports = { gerarContratoPDF };

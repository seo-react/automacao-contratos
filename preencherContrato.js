// 1. Importa a biblioteca oficial do Google
const { google } = require('googleapis');

// 2. Autentica usando o arquivo de credenciais da conta de serviço
const auth = new google.auth.GoogleAuth({
  keyFile: 'credenciais.json',
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive'
  ]
});

// 3. Função principal que preenche o contrato
async function preencherContrato(dados) {
  const client = await auth.getClient();
  const docs = google.docs({ version: 'v1', auth: client });

  const modeloId = '1kGxkIxCZlQkTpTvrl3dBlrZGFTsdITbnmnXzeZtYfCM'; // ID do seu modelo de contrato

  // ⚠️ Removido o trecho que copia o modelo
  const novoId = modeloId; // Edita diretamente o modelo

  // 4. Cria as instruções para substituir os campos {{campo}} no documento
  const requests = Object.entries(dados).map(([chave, valor]) => ({
    replaceAllText: {
      containsText: { text: `{{${chave}}}`, matchCase: true },
      replaceText: valor
    }
  }));

  // 5. Aplica as substituições no documento
  await docs.documents.batchUpdate({
    documentId: novoId,
    requestBody: { requests }
  });

  // 6. Exibe o link do contrato preenchido
  console.log(`✅ Contrato preenchido: https://docs.google.com/document/d/${novoId}/edit`);
}

// 7. Dados do formulário que serão inseridos no contrato
const dadosFormulario = {
  razao_social: 'Agência Tribo LTDA',
  cnpj: '21.397.810/0001-10',
  endereco_completo: 'Rua das Flores, 123 - Centro - João Pessoa/PB - CEP 58000-000',
  nome_representante: 'Abdiel Marins',
  email_representante: 'abdiel@agenciatribo.com.br',
  servico: 'Gestão de Redes Sociais',
  valor: 'R$ 3.500,00',
  data_inicio: '01/10/2025',
  data_termino: '30/09/2026'
};

// 8. Executa a função com os dados
preencherContrato(dadosFormulario);

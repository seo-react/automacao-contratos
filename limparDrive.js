const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credenciais.json',
  scopes: ['https://www.googleapis.com/auth/drive']
});

async function limparDrive() {
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  // 1. Lista os arquivos da conta de serviço
  const arquivos = await drive.files.list({
    pageSize: 100,
    fields: 'files(id, name, createdTime)'
  });

  const lista = arquivos.data.files;

  if (lista.length === 0) {
    console.log('✅ Nenhum arquivo encontrado na conta de serviço.');
    return;
  }

  console.log(`🧾 ${lista.length} arquivos encontrados. Iniciando exclusão...`);

  // 2. Exclui cada arquivo
  for (const arquivo of lista) {
    try {
      await drive.files.delete({ fileId: arquivo.id });
      console.log(`🗑️ Excluído: ${arquivo.name}`);
    } catch (err) {
      console.error(`❌ Erro ao excluir ${arquivo.name}:`, err.message);
    }
  }

  console.log('✅ Limpeza concluída.');
}

limparDrive();

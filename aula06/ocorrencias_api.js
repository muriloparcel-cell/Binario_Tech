const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const ARQUIVO_DADOS = path.join(__dirname, 'ocorrencias.json');

app.use(cors());
app.use(express.json());

// Funcao Auxiliar: Ler arquivo JSON
async function lerOcorrencias() {
	try {
		const dados = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
		return JSON.parse(dados);
	} catch (erro) {
		// Se o arquivo nao existir, retorna array vazio e cria o arquivo
		await fs.writeFile(ARQUIVO_DADOS, '[]', 'utf-8');
		return [];
	}
}

// Funcao Auxiliar: Salvar no arquivo JSON
async function salvarOcorrencias(ocorrencias) {
	await fs.writeFile(ARQUIVO_DADOS, JSON.stringify(ocorrencias, null, 2), 'utf-8');
}

// ROTA 1: Listar todas as ocorrencias
app.get('/api/v1/ocorrencias', async (req, res) => {
	try {
		const ocorrencias = await lerOcorrencias();
		res.status(200).json(ocorrencias);
	} catch (erro) {
		res.status(500).josn({ erro: "Erro ao ler base de dados em disco." });
	}
});

app.get('/api/v1/ocorrencias/montadora/:nome', async (req, res) => {
	try {
		const { nome } = req.params;
		const ocorrencias = await lerOcorrencias()

		const filtradas = ocorrencias.filter(
			item => item.montadora.toLowerCase() === nome.toLowerCase()
		);

		res.status(200).json(filtradas);
	} catch (erro) {
		res.status(500).json({ erro: "Erro ao buscar ocorrencias por montadora." });
	}
});

// ROTA 2: Cadastrar nova ocorrencia na frota
app.post('/api/v1/ocorrencias', async (req, res) => {
	try {
		const { montadora, placa, descricao, gravidade } = req.body;

		if (!montadora || !placa || !descricao) {
			return res.status(400).json({ erro: "Montadora, placa e descricao sao obrigatorios." });
		}

		const ocorrencias = await lerOcorrencias();
		const novaOcorrencia = {
			id: Date.now(),
			montadora,
			placa,
			descricao,
			gravidade: gravidade || "MEDIA",
			data_registro: new Date().toISOString()
		};

		ocorrencias.push(novaOcorrencia);
		await salvarOcorrencias(ocorrencias);

		res.status(201).json(novaOcorrencia);
	} catch (erro) {
		res.status(500).json({ erro: "Erro ao salvar ocorrencia em disco." });
	}
});


// DELETE
app.delete('/api/v1/ocorrencias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ocorrencias = await lerOcorrencias();

    // Procura o índice do registro pelo ID (converte o id da URL para Number)
    const index = ocorrencias.findIndex((o) => o.id === Number(id));

    // Se não encontrar o ID, retorna 404
    if (index === -1) {
      return res.status(404).json({ erro: `Ocorrência com ID ${id} não encontrada.` });
    }

    // Remove a ocorrência do array e salva o array atualizado no disco
    const [ocorrenciaRemovida] = ocorrencias.splice(index, 1);
    await salvarOcorrencias(ocorrencias);

    // Retorna a ocorrência removida e confirmação
    res.status(200).json({
      mensagem: "Ocorrência removida com sucesso.",
      ocorrencia: ocorrenciaRemovida
    });
  } catch (erro) {
    console.error("Erro interno no DELETE:", erro);
    res.status(500).json({ erro: "Erro ao remover ocorrência do disco." });
  }
});

app.listen(PORT, () => {
	console.log(`[Binario Tech] API de Ocorrencias ativa na porta ${PORT}`);
});


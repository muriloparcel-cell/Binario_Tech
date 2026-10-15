const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Banco de veiculos
let veiculos = [
	{ id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
	{ id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// Rota GET (Listar os veiculos registrados no banco de dados com a opção de filtragem por status)
app.get('/api/v1/veiculos', (req, res) => {
	const { status } = req.query;
	if (status) {
		const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
		return res.status(200).json(filtrados);
	}
	res.status(200).json(veiculos);
});

// Rota GET (Procurar veiculos com o certo ID)
app.get('/api/v1/veiculos/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const veiculo = veiculos.find(v => v.id === id);
	if (!veiculo) {
		return res.status(404).json({ erro: "Veiculo não encontrado" });
	}
	res.status(200).json(veiculo);
});

// Rota Post (Cadastrar novos veiculos por enviar campo placa, montadora e modelo, define o status "DISPONIVEL" por padrão)
app.post('/api/v1/veiculos', (req, res) => {
	const { placa, montadora, modelo } = req.body;
	if (!placa || !montadora || !modelo) {
		return res.status(404).json({ erro: "Certifique-se de colocar todos os três campos: 'placa', 'montadora' e 'modelo'" });
	}
	const novoVeiculo = {
		id: veiculos.lenght ++,
		placa,
		montadora,
		modelo,
		status: "DISPONIVEL"
	};
	veiculos.push(novoVeiculo);
	res.status(201).json(novoVeiculo);
});

// Rota PATCH (Atualizar o campo status do veiculo cadastrado)
app.patch('api/v1/veiculos/:id/status', (req, res) => {
	const id = parseInt(req.params.id);
	const { status } = req.body;
	const veiculo = veiculos.find(v => v.id === id);

	if (!veiculo) {
		return res.status(404).json({ erro: "Veiculo não foi encontrado." });
	}
	if (!status) {
		return res.status(400).json({ erro: "É necessario o campo 'status'" });
	}

	veiculo.status = status.toUpperCase();
	res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// Rota DELETE (Apagar um dos veiculos registrados de acordo com o id)
app.delete('api/v1/veiculos/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const index = veiculos.findIndex(v => v.id === id);
	if (index === -1) {
		return res.status(404).json({ erro: "Veiculo não foi encontrado." });
	}
	veiculos.splice(index, 1);
	res.status(200).json({ mensagem: `Veiculo apagado com o ID ${id} com sucesso` });
});

// Rota PUT (Substituir todos os dados de um veiculo)
app.put('/api/v1/veiculos/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const { placa, montadora, modelo, status } = req.body;

	const veiculo = veiculos.find(v => v.id === id);
	if (!veiculo) {
		return res.status(404).json({ erro: "Veiculo não foi encontrado" });
	}

	if (!placa || !montadora || !modelo || !status) {
		return res.status(400).json({ erro: "Campos 'placa', 'montadora', 'modelo' e 'status' são necessários." });
	}

	veiculo.placa = placa;
	veiculo.montadora = montadora;
	veiculo.modelo = modelo;
	veiculo.status = status.toUpperCase();

	return res.status(200).json({ mensagem: "Veiculo substituido com sucesso!", veiculo });
});

app.listen(PORT, () => {
	console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
			

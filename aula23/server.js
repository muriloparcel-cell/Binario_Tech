require('dotenv').config();
const express = require('express');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 5000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

app.use(express.json());

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('\[Erro Redis\]', err));

async function init() {
await client.connect();
console.log('\[Binário Tech\] Conectado ao servidor Redis com sucesso!');
}

init();

// Rota com contador de acessos via Redis
app.get('/api/v1/visitas', async (req, res) => {
	try {
		const visitas = await client.incr('contador_visitas');
	res.json({status: "SUCESSO",
		mensagem: "Contador atualizado no Redis com sucesso!",
		totalVisitas: visitas,
		instanciaHost: require('os').hostname(),
		timestamp: new Date()
	});
	} catch (error) {
		res.status(500).json({ status: "ERRO", mensagem: error.message });
	}
});

// Rota DELETE para resetar o contador
app.delete('/api/v1/visitas/reset', async (req, res) => {
	try {
		await client.del('contador_visitas');

		return res.status(200).json({
			sucesso: true,
			mensagem: 'Contador de visitas zerado com sucesso.',
			visitas: 0
		});
	} catch (error) {
		console.error('Erro ao resetar a contagem no Redis:', error);
		return res.status(500).json({
			sucesso: false,
			mensagem: 'Erro ao tentar resetar o contador.'
		});
	}
});

app.listen(PORT, () => {
console.log(`[Binário Tech] API Orquestrada rodando na porta ${PORT}`);
});

const express = require('express');
const router = express.Router();
const telemetriaController = require('../controllers/telemetriaController');
const db = require('../database/connection');

// Auxiliar: Rota para popular veiculo do teste
router.post('/veiculo-teste', async (req, res) => {
	try {
		const { placa, montadora, modelo } = req.body;
		const [id] = await db('veiculos').insert({ placa, montadora, modelo });
		res.status(201).json({ id, placa, montadora, modelo });
	} catch (erro) {
		res.status(500).json({ erro: "Erro ao cadastrar veiculo de teste." });
	}
});

router.post('/', telemetriaController.registrarLeitura);
router.get('/relatorio', telemetriaController.listaRelatorioCompleto);
router.get('/veiculo/:id', telemetriaController.buscarPorVeiculo);

module.exports = router;

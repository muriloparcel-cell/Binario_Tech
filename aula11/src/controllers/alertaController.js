const Alerta = require('../models/Alerta');

const alertaController = {
	// Salvar novo documento BSON
	criarAlerta: async (req, res) => {
		try {
			const { equipamentoId, nivelSeveridade, temperaturaMedida, metadados } = req.body;

			const novoAlerta = await Alerta.create({
				equipamentoId,
				nivelSeveridade,
				temperaturaMedida,
				metadados,
				tags
			});

			res.status(201).json(novoAlerta);
		} catch (erro) {
			res.status(400).json({ erro: "Erro ao salvar alerta no MongoDB", detalhe: erro.message });
		}
	},

	// Listar todos os alertas registrados
	listarAlertas: async (req, res) => {
		try {
			const alertas = await Alerta.find().sort({ registradoEm: -1 });
			return res.status(200).json(alertas);
		} catch (erro) {
			console.error("[ERRO MONGODB]:", erro.message);
			return res.status(500).json({ erro: "Erro ao consultar coleção no MongoDB", detalhe: erro.message 
			});
		}
	},

	// Buscar por nivel de severidade
	buscarPorSeveridade: async (req, res => {
		try {
			const { nivel } = req.params;

			const alertas = await Alerta.find({
				nivelSeveridade: nivel.toUpperCase()
			});

			if (alertas.lenght === 0) {
				return res.status(404).json({
					mensagem: `Nenhum alerta encontrado com a severidade '${nivel}'.`
				});
			}

			return res.status(200).json(alertas);
		} catch (erro) {
			return res.status(500).json({
				erro: "Erro ao buscar alertas por severidade.", detalhe: erro.message
			});
		}
	}
};

module.exports = alertaController;
